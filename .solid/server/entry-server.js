import { renderToStringAsync, isServer, createComponent, mergeProps, ssr, ssrHydrationKey, ssrSpread, ssrAttribute, escape, Assets, HydrationScript, NoHydration } from 'solid-js/web';
import { createContext, createSignal, onMount, onCleanup, getOwner, runWithOwner, createMemo, useContext, createComponent as createComponent$1, useTransition, createRenderEffect, untrack, on, resetErrorBoundaries, mergeProps as mergeProps$1, splitProps, children, createRoot, Show, lazy, ErrorBoundary as ErrorBoundary$1, Suspense, sharedConfig } from 'solid-js';

function renderAsync(fn, options) {
  return () => async (context) => {
    let markup = await renderToStringAsync(() => fn(context), options);
    if (context.routerContext.url) {
      return Response.redirect(new URL(context.routerContext.url, context.request.url), 302);
    }
    context.responseHeaders.set("Content-Type", "text/html");
    return new Response(markup, {
      status: 200,
      headers: context.responseHeaders
    });
  };
}

const MetaContext = createContext();
const cascadingTags = ["title", "meta"];

const MetaProvider = props => {
  const indices = new Map(),
        [tags, setTags] = createSignal({});
  onMount(() => {
    const ssrTags = document.head.querySelectorAll(`[data-sm=""]`); // `forEach` on `NodeList` is not supported in Googlebot, so use a workaround

    Array.prototype.forEach.call(ssrTags, ssrTag => ssrTag.parentNode.removeChild(ssrTag));
  });
  const actions = {
    addClientTag: (tag, name) => {
      // consider only cascading tags
      if (cascadingTags.indexOf(tag) !== -1) {
        setTags(tags => {
          const names = tags[tag] || [];
          return { ...tags,
            [tag]: [...names, name]
          };
        }); // track indices synchronously

        const index = indices.has(tag) ? indices.get(tag) + 1 : 0;
        indices.set(tag, index);
        return index;
      }

      return -1;
    },
    shouldRenderTag: (tag, index) => {
      if (cascadingTags.indexOf(tag) !== -1) {
        const names = tags()[tag]; // check if the tag is the last one of similar

        return names && names.lastIndexOf(names[index]) === index;
      }

      return true;
    },
    removeClientTag: (tag, index) => {
      setTags(tags => {
        const names = tags[tag];

        if (names) {
          names[index] = null;
          return { ...tags,
            [tag]: names
          };
        }

        return tags;
      });
    }
  };

  if (isServer) {
    actions.addServerTag = tagDesc => {
      const {
        tags = []
      } = props; // tweak only cascading tags

      if (cascadingTags.indexOf(tagDesc.tag) !== -1) {
        const index = tags.findIndex(prev => {
          const prevName = prev.props.name || prev.props.property;
          const nextName = tagDesc.props.name || tagDesc.props.property;
          return prev.tag === tagDesc.tag && prevName === nextName;
        });

        if (index !== -1) {
          tags.splice(index, 1);
        }
      }

      tags.push(tagDesc);
    };

    if (Array.isArray(props.tags) === false) {
      throw Error("tags array should be passed to <MetaProvider /> in node");
    }
  }

  return createComponent(MetaContext.Provider, {
    value: actions,

    get children() {
      return props.children;
    }

  });
};
function renderTags(tags) {
  return tags.map(tag => {
    const keys = Object.keys(tag.props);
    const props = keys.map(k => k === "children" ? "" : ` ${k}="${tag.props[k]}"`).join("");
    return tag.props.children ? `<${tag.tag} data-sm=""${props}>${// Tags might contain multiple text children:
    //   <Title>example - {myCompany}</Title>
    Array.isArray(tag.props.children) ? tag.props.children.join("") : tag.props.children}</${tag.tag}>` : `<${tag.tag} data-sm=""${props}/>`;
  }).join("");
}

function bindEvent(target, type, handler) {
    target.addEventListener(type, handler);
    return () => target.removeEventListener(type, handler);
}
function intercept([value, setValue], get, set) {
    return [get ? () => get(value()) : value, set ? (v) => setValue(set(v)) : setValue];
}
function querySelector(selector) {
    // Guard against selector being an invalid CSS selector
    try {
        return document.querySelector(selector);
    }
    catch (e) {
        return null;
    }
}
function scrollToHash(hash, fallbackTop) {
    const el = querySelector(`#${hash}`);
    if (el) {
        el.scrollIntoView();
    }
    else if (fallbackTop) {
        window.scrollTo(0, 0);
    }
}
function createIntegration(get, set, init, utils) {
    let ignore = false;
    const wrap = (value) => (typeof value === "string" ? { value } : value);
    const signal = intercept(createSignal(wrap(get()), { equals: (a, b) => a.value === b.value }), undefined, next => {
        !ignore && set(next);
        return next;
    });
    init &&
        onCleanup(init((value = get()) => {
            ignore = true;
            signal[1](wrap(value));
            ignore = false;
        }));
    return {
        signal,
        utils
    };
}
function normalizeIntegration(integration) {
    if (!integration) {
        return {
            signal: createSignal({ value: "" })
        };
    }
    else if (Array.isArray(integration)) {
        return {
            signal: integration
        };
    }
    return integration;
}
function staticIntegration(obj) {
    return {
        signal: [() => obj, next => Object.assign(obj, next)]
    };
}
function pathIntegration() {
    return createIntegration(() => ({
        value: window.location.pathname + window.location.search + window.location.hash,
        state: history.state
    }), ({ value, replace, scroll, state }) => {
        if (replace) {
            window.history.replaceState(state, "", value);
        }
        else {
            window.history.pushState(state, "", value);
        }
        scrollToHash(window.location.hash.slice(1), scroll);
    }, notify => bindEvent(window, "popstate", () => notify()), {
        go: delta => window.history.go(delta)
    });
}

const hasSchemeRegex = /^(?:[a-z0-9]+:)?\/\//i;
const trimPathRegex = /^\/+|\/+$/g;
function normalize(path, omitSlash = false) {
    const s = path.replace(trimPathRegex, "");
    return s ? (omitSlash || /^[?#]/.test(s) ? s : "/" + s) : "";
}
function resolvePath(base, path, from) {
    if (hasSchemeRegex.test(path)) {
        return undefined;
    }
    const basePath = normalize(base);
    const fromPath = from && normalize(from);
    let result = "";
    if (!fromPath || path.startsWith("/")) {
        result = basePath;
    }
    else if (fromPath.toLowerCase().indexOf(basePath.toLowerCase()) !== 0) {
        result = basePath + fromPath;
    }
    else {
        result = fromPath;
    }
    return (result || "/") + normalize(path, !result);
}
function invariant(value, message) {
    if (value == null) {
        throw new Error(message);
    }
    return value;
}
function joinPaths(from, to) {
    return normalize(from).replace(/\/*(\*.*)?$/g, "") + normalize(to);
}
function extractSearchParams(url) {
    const params = {};
    url.searchParams.forEach((value, key) => {
        params[key] = value;
    });
    return params;
}
function urlDecode(str, isQuery) {
    return decodeURIComponent(isQuery ? str.replace(/\+/g, " ") : str);
}
function createMatcher(path, partial) {
    const [pattern, splat] = path.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    const len = segments.length;
    return (location) => {
        const locSegments = location.split("/").filter(Boolean);
        const lenDiff = locSegments.length - len;
        if (lenDiff < 0 || (lenDiff > 0 && splat === undefined && !partial)) {
            return null;
        }
        const match = {
            path: len ? "" : "/",
            params: {}
        };
        for (let i = 0; i < len; i++) {
            const segment = segments[i];
            const locSegment = locSegments[i];
            if (segment[0] === ":") {
                match.params[segment.slice(1)] = locSegment;
            }
            else if (segment.localeCompare(locSegment, undefined, { sensitivity: "base" }) !== 0) {
                return null;
            }
            match.path += `/${locSegment}`;
        }
        if (splat) {
            match.params[splat] = lenDiff ? locSegments.slice(-lenDiff).join("/") : "";
        }
        return match;
    };
}
function scoreRoute(route) {
    const [pattern, splat] = route.pattern.split("/*", 2);
    const segments = pattern.split("/").filter(Boolean);
    return segments.reduce((score, segment) => score + (segment.startsWith(":") ? 2 : 3), segments.length - (splat === undefined ? 0 : 1));
}
function createMemoObject(fn) {
    const map = new Map();
    const owner = getOwner();
    return new Proxy({}, {
        get(_, property) {
            if (!map.has(property)) {
                runWithOwner(owner, () => map.set(property, createMemo(() => fn()[property])));
            }
            return map.get(property)();
        },
        getOwnPropertyDescriptor() {
            return {
                enumerable: true,
                configurable: true
            };
        },
        ownKeys() {
            return Reflect.ownKeys(fn());
        }
    });
}
function expandOptionals(pattern) {
    let match = /(\/?\:[^\/]+)\?/.exec(pattern);
    if (!match)
        return [pattern];
    let prefix = pattern.slice(0, match.index);
    let suffix = pattern.slice(match.index + match[0].length);
    const prefixes = [prefix, (prefix += match[1])];
    // This section handles adjacent optional params. We don't actually want all permuations since
    // that will lead to equivalent routes which have the same number of params. For example
    // `/:a?/:b?/:c`? only has the unique expansion: `/`, `/:a`, `/:a/:b`, `/:a/:b/:c` and we can
    // discard `/:b`, `/:c`, `/:b/:c` by building them up in order and not recursing. This also helps
    // ensure predictability where earlier params have precidence.
    while ((match = /^(\/\:[^\/]+)\?/.exec(suffix))) {
        prefixes.push((prefix += match[1]));
        suffix = suffix.slice(match[0].length);
    }
    return expandOptionals(suffix).reduce((results, expansion) => [...results, ...prefixes.map(p => p + expansion)], []);
}

const MAX_REDIRECTS = 100;
const RouterContextObj = createContext();
const RouteContextObj = createContext();
const useRouter = () => invariant(useContext(RouterContextObj), "Make sure your app is wrapped in a <Router />");
let TempRoute;
const useRoute = () => TempRoute || useContext(RouteContextObj) || useRouter().base;
const useResolvedPath = (path) => {
    const route = useRoute();
    return createMemo(() => route.resolvePath(path()));
};
const useHref = (to) => {
    const router = useRouter();
    return createMemo(() => {
        const to_ = to();
        return to_ !== undefined ? router.renderPath(to_) : to_;
    });
};
const useLocation = () => useRouter().location;
function createRoutes(routeDef, base = "", fallback) {
    const { component, data, children } = routeDef;
    const isLeaf = !children || (Array.isArray(children) && !children.length);
    const shared = {
        key: routeDef,
        element: component
            ? () => createComponent$1(component, {})
            : () => {
                const { element } = routeDef;
                return element === undefined && fallback
                    ? createComponent$1(fallback, {})
                    : element;
            },
        preload: routeDef.component
            ? component.preload
            : routeDef.preload,
        data
    };
    return asArray(routeDef.path).reduce((acc, path) => {
        for (const originalPath of expandOptionals(path)) {
            const path = joinPaths(base, originalPath);
            const pattern = isLeaf ? path : path.split("/*", 1)[0];
            acc.push({
                ...shared,
                originalPath,
                pattern,
                matcher: createMatcher(pattern, !isLeaf)
            });
        }
        return acc;
    }, []);
}
function createBranch(routes, index = 0) {
    return {
        routes,
        score: scoreRoute(routes[routes.length - 1]) * 10000 - index,
        matcher(location) {
            const matches = [];
            for (let i = routes.length - 1; i >= 0; i--) {
                const route = routes[i];
                const match = route.matcher(location);
                if (!match) {
                    return null;
                }
                matches.unshift({
                    ...match,
                    route
                });
            }
            return matches;
        }
    };
}
function asArray(value) {
    return Array.isArray(value) ? value : [value];
}
function createBranches(routeDef, base = "", fallback, stack = [], branches = []) {
    const routeDefs = asArray(routeDef);
    for (let i = 0, len = routeDefs.length; i < len; i++) {
        const def = routeDefs[i];
        if (def && typeof def === "object" && def.hasOwnProperty("path")) {
            const routes = createRoutes(def, base, fallback);
            for (const route of routes) {
                stack.push(route);
                if (def.children) {
                    createBranches(def.children, route.pattern, fallback, stack, branches);
                }
                else {
                    const branch = createBranch([...stack], branches.length);
                    branches.push(branch);
                }
                stack.pop();
            }
        }
    }
    // Stack will be empty on final return
    return stack.length ? branches : branches.sort((a, b) => b.score - a.score);
}
function getRouteMatches$1(branches, location) {
    for (let i = 0, len = branches.length; i < len; i++) {
        const match = branches[i].matcher(location);
        if (match) {
            return match;
        }
    }
    return [];
}
function createLocation(path, state) {
    const origin = new URL("http://sar");
    const url = createMemo(prev => {
        const path_ = path();
        try {
            return new URL(path_, origin);
        }
        catch (err) {
            console.error(`Invalid path ${path_}`);
            return prev;
        }
    }, origin, {
        equals: (a, b) => a.href === b.href
    });
    const pathname = createMemo(() => urlDecode(url().pathname));
    const search = createMemo(() => urlDecode(url().search, true));
    const hash = createMemo(() => urlDecode(url().hash));
    const key = createMemo(() => "");
    return {
        get pathname() {
            return pathname();
        },
        get search() {
            return search();
        },
        get hash() {
            return hash();
        },
        get state() {
            return state();
        },
        get key() {
            return key();
        },
        query: createMemoObject(on(search, () => extractSearchParams(url())))
    };
}
function createRouterContext(integration, base = "", data, out) {
    const { signal: [source, setSource], utils = {} } = normalizeIntegration(integration);
    const parsePath = utils.parsePath || (p => p);
    const renderPath = utils.renderPath || (p => p);
    const basePath = resolvePath("", base);
    const output = isServer && out
        ? Object.assign(out, {
            matches: [],
            url: undefined
        })
        : undefined;
    if (basePath === undefined) {
        throw new Error(`${basePath} is not a valid base path`);
    }
    else if (basePath && !source().value) {
        setSource({ value: basePath, replace: true, scroll: false });
    }
    const [isRouting, start] = useTransition();
    const [reference, setReference] = createSignal(source().value);
    const [state, setState] = createSignal(source().state);
    const location = createLocation(reference, state);
    const referrers = [];
    const baseRoute = {
        pattern: basePath,
        params: {},
        path: () => basePath,
        outlet: () => null,
        resolvePath(to) {
            return resolvePath(basePath, to);
        }
    };
    if (data) {
        try {
            TempRoute = baseRoute;
            baseRoute.data = data({
                data: undefined,
                params: {},
                location,
                navigate: navigatorFactory(baseRoute)
            });
        }
        finally {
            TempRoute = undefined;
        }
    }
    function navigateFromRoute(route, to, options) {
        // Untrack in case someone navigates in an effect - don't want to track `reference` or route paths
        untrack(() => {
            if (typeof to === "number") {
                if (!to) ;
                else if (utils.go) {
                    utils.go(to);
                }
                else {
                    console.warn("Router integration does not support relative routing");
                }
                return;
            }
            const { replace, resolve, scroll, state: nextState } = {
                replace: false,
                resolve: true,
                scroll: true,
                ...options
            };
            const resolvedTo = resolve ? route.resolvePath(to) : resolvePath("", to);
            if (resolvedTo === undefined) {
                throw new Error(`Path '${to}' is not a routable path`);
            }
            else if (referrers.length >= MAX_REDIRECTS) {
                throw new Error("Too many redirects");
            }
            const current = reference();
            if (resolvedTo !== current || nextState !== state()) {
                if (isServer) {
                    if (output) {
                        output.url = resolvedTo;
                    }
                    setSource({ value: resolvedTo, replace, scroll, state: nextState });
                }
                else {
                    const len = referrers.push({ value: current, replace, scroll, state: state() });
                    start(() => {
                        setReference(resolvedTo);
                        setState(nextState);
                        resetErrorBoundaries();
                    }).then(() => {
                        if (referrers.length === len) {
                            navigateEnd({
                                value: resolvedTo,
                                state: nextState
                            });
                        }
                    });
                }
            }
        });
    }
    function navigatorFactory(route) {
        // Workaround for vite issue (https://github.com/vitejs/vite/issues/3803)
        route = route || useContext(RouteContextObj) || baseRoute;
        return (to, options) => navigateFromRoute(route, to, options);
    }
    function navigateEnd(next) {
        const first = referrers[0];
        if (first) {
            if (next.value !== first.value || next.state !== first.state) {
                setSource({
                    ...next,
                    replace: first.replace,
                    scroll: first.scroll
                });
            }
            referrers.length = 0;
        }
    }
    createRenderEffect(() => {
        const { value, state } = source();
        // Untrack this whole block so `start` doesn't cause Solid's Listener to be preserved
        untrack(() => {
            if (value !== reference()) {
                start(() => {
                    setReference(value);
                    setState(state);
                });
            }
        });
    });
    if (!isServer) {
        function isSvg(el) {
            return el.namespaceURI === "http://www.w3.org/2000/svg";
        }
        function handleAnchorClick(evt) {
            if (evt.defaultPrevented ||
                evt.button !== 0 ||
                evt.metaKey ||
                evt.altKey ||
                evt.ctrlKey ||
                evt.shiftKey)
                return;
            const a = evt
                .composedPath()
                .find(el => el instanceof Node && el.nodeName.toUpperCase() === "A");
            if (!a)
                return;
            const svg = isSvg(a);
            const href = svg ? a.href.baseVal : a.href;
            const target = svg ? a.target.baseVal : a.target;
            if (target || (!href && !a.hasAttribute("state")))
                return;
            const rel = (a.getAttribute("rel") || "").split(/\s+/);
            if (a.hasAttribute("download") || (rel && rel.includes("external")))
                return;
            const url = svg ? new URL(href, document.baseURI) : new URL(href);
            const pathname = urlDecode(url.pathname);
            if (url.origin !== window.location.origin ||
                (basePath && pathname && !pathname.toLowerCase().startsWith(basePath.toLowerCase())))
                return;
            const to = parsePath(pathname + urlDecode(url.search, true) + urlDecode(url.hash));
            const state = a.getAttribute("state");
            evt.preventDefault();
            navigateFromRoute(baseRoute, to, {
                resolve: false,
                replace: a.hasAttribute("replace"),
                scroll: !a.hasAttribute("noscroll"),
                state: state && JSON.parse(state)
            });
        }
        document.addEventListener("click", handleAnchorClick);
        onCleanup(() => document.removeEventListener("click", handleAnchorClick));
    }
    return {
        base: baseRoute,
        out: output,
        location,
        isRouting,
        renderPath,
        parsePath,
        navigatorFactory
    };
}
function createRouteContext(router, parent, child, match) {
    const { base, location, navigatorFactory } = router;
    const { pattern, element: outlet, preload, data } = match().route;
    const path = createMemo(() => match().path);
    const params = createMemoObject(() => match().params);
    preload && preload();
    const route = {
        parent,
        pattern,
        get child() {
            return child();
        },
        path,
        params,
        data: parent.data,
        outlet,
        resolvePath(to) {
            return resolvePath(base.path(), to, path());
        }
    };
    if (data) {
        try {
            TempRoute = route;
            route.data = data({ data: parent.data, params, location, navigate: navigatorFactory(route) });
        }
        finally {
            TempRoute = undefined;
        }
    }
    return route;
}

const _tmpl$$a = ["<a", " ", ">", "</a>"];
const Router = props => {
  const {
    source,
    url,
    base,
    data,
    out
  } = props;
  const integration = source || (isServer ? staticIntegration({
    value: url || ""
  }) : pathIntegration());
  const routerState = createRouterContext(integration, base, data, out);
  return createComponent(RouterContextObj.Provider, {
    value: routerState,

    get children() {
      return props.children;
    }

  });
};
const Routes$1 = props => {
  const router = useRouter();
  const parentRoute = useRoute();
  const routeDefs = children(() => props.children);
  const branches = createMemo(() => createBranches(routeDefs(), joinPaths(parentRoute.pattern, props.base || ""), Outlet));
  const matches = createMemo(() => getRouteMatches$1(branches(), router.location.pathname));

  if (router.out) {
    router.out.matches.push(matches().map(({
      route,
      path,
      params
    }) => ({
      originalPath: route.originalPath,
      pattern: route.pattern,
      path,
      params
    })));
  }

  const disposers = [];
  let root;
  const routeStates = createMemo(on(matches, (nextMatches, prevMatches, prev) => {
    let equal = prevMatches && nextMatches.length === prevMatches.length;
    const next = [];

    for (let i = 0, len = nextMatches.length; i < len; i++) {
      const prevMatch = prevMatches && prevMatches[i];
      const nextMatch = nextMatches[i];

      if (prev && prevMatch && nextMatch.route.key === prevMatch.route.key) {
        next[i] = prev[i];
      } else {
        equal = false;

        if (disposers[i]) {
          disposers[i]();
        }

        createRoot(dispose => {
          disposers[i] = dispose;
          next[i] = createRouteContext(router, next[i - 1] || parentRoute, () => routeStates()[i + 1], () => matches()[i]);
        });
      }
    }

    disposers.splice(nextMatches.length).forEach(dispose => dispose());

    if (prev && equal) {
      return prev;
    }

    root = next[0];
    return next;
  }));
  return createComponent(Show, {
    get when() {
      return routeStates() && root;
    },

    children: route => createComponent(RouteContextObj.Provider, {
      value: route,

      get children() {
        return route.outlet();
      }

    })
  });
};
const useRoutes = (routes, base) => {
  return () => createComponent(Routes$1, {
    base: base,
    children: routes
  });
};
const Outlet = () => {
  const route = useRoute();
  return createComponent(Show, {
    get when() {
      return route.child;
    },

    children: child => createComponent(RouteContextObj.Provider, {
      value: child,

      get children() {
        return child.outlet();
      }

    })
  });
};

function LinkBase(props) {
  const [, rest] = splitProps(props, ["children", "to", "href", "state"]);
  const href = useHref(() => props.to);
  return ssr(_tmpl$$a, ssrHydrationKey(), ssrSpread(rest, false, true) + ssrAttribute("href", escape(href(), true) || escape(props.href, true), false) + ssrAttribute("state", escape(JSON.stringify(props.state), true), false), escape(props.children));
}

function Link(props) {
  const to = useResolvedPath(() => props.href);
  return createComponent(LinkBase, mergeProps(props, {
    get to() {
      return to();
    }

  }));
}
function NavLink(props) {
  props = mergeProps$1({
    inactiveClass: "inactive",
    activeClass: "active"
  }, props);
  const [, rest] = splitProps(props, ["activeClass", "inactiveClass", "end"]);
  const location = useLocation();
  const to = useResolvedPath(() => props.href);
  const isActive = createMemo(() => {
    const to_ = to();

    if (to_ === undefined) {
      return false;
    }

    const path = to_.split(/[?#]/, 1)[0].toLowerCase();
    const loc = location.pathname.toLowerCase();
    return props.end ? path === loc : loc.startsWith(path);
  });
  return createComponent(LinkBase, mergeProps(rest, {
    get to() {
      return to();
    },

    get classList() {
      return {
        [props.inactiveClass]: !isActive(),
        [props.activeClass]: isActive()
      };
    },

    get ["aria-current"]() {
      return isActive() ? "page" : undefined;
    }

  }));
}

const StartContext = createContext({});
function StartProvider(props) {
  const [request, setRequest] = createSignal(new Request(isServer ? props.context.request.url : window.location.pathname)); // TODO: throw error if values are used on client for anything more than stubbing
  // OR replace with actual request that updates with the current URL

  return createComponent(StartContext.Provider, {
    get value() {
      return props.context || {
        get request() {
          return request();
        },

        get responseHeaders() {
          return new Headers();
        },

        get tags() {
          return [];
        },

        get manifest() {
          return {};
        },

        get routerContext() {
          return {};
        },

        setStatusCode(code) {},

        setHeader(name, value) {}

      };
    },

    get children() {
      return props.children;
    }

  });
}

const _tmpl$$9 = ["<link", " rel=\"stylesheet\"", ">"],
      _tmpl$2$1 = ["<link", " rel=\"modulepreload\"", ">"];

function getAssetsFromManifest(manifest, routerContext) {
  const match = routerContext.matches.reduce((memo, m) => {
    memo.push(...(manifest[mapRouteToFile(m)] || []));
    return memo;
  }, []);
  const links = match.reduce((r, src) => {
    r[src.href] = src.type === "style" ? ssr(_tmpl$$9, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false)) : ssr(_tmpl$2$1, ssrHydrationKey(), ssrAttribute("href", escape(src.href, true), false));
    return r;
  }, {});
  return Object.values(links);
}

function mapRouteToFile(matches) {
  return matches.map(h => h.originalPath.replace(/:(\w+)/, (f, g) => `[${g}]`).replace(/\*(\w+)/, (f, g) => `[...${g}]`)).join("");
}
/**
 * Links are used to load assets for the server.
 * @returns {JSXElement}
 */


function Links() {
  const context = useContext(StartContext);
  return createComponent(Assets, {
    get children() {
      return getAssetsFromManifest(context.manifest, context.routerContext);
    }

  });
}

function Meta() {
  const context = useContext(StartContext); // @ts-expect-error The ssr() types do not match the Assets child types

  return createComponent(Assets, {
    get children() {
      return ssr(renderTags(context.tags));
    }

  });
}

/// <reference path="../server/types.tsx" />
const routes = [{
  component: lazy(() => Promise.resolve().then(function () { return catering; })),
  path: "/catering"
}, {
  component: lazy(() => Promise.resolve().then(function () { return contact; })),
  path: "/contact"
}, {
  component: lazy(() => Promise.resolve().then(function () { return farmersMarket; })),
  path: "/farmers-market"
}, {
  component: lazy(() => Promise.resolve().then(function () { return index; })),
  path: "/"
}]; // console.log(routes);

/**
 * Routes are the file system based routes, used by Solid App Router to show the current page according to the URL.
 */

const Routes = useRoutes(routes);

const _tmpl$$8 = ["<script", " type=\"module\" async", "></script>"];

function getFromManifest(manifest) {
  const match = manifest["*"];
  const entry = match.find(src => src.type === "script");
  return ssr(_tmpl$$8, ssrHydrationKey(), ssrAttribute("src", escape(entry.href, true), false));
}

function Scripts() {
  const context = useContext(StartContext);
  return [createComponent(HydrationScript, {}), createComponent(NoHydration, {
    get children() {
      return isServer && (getFromManifest(context.manifest));
    }

  })];
}

const _tmpl$$7 = ["<div", " style=\"", "\"><div style=\"", "\"><p style=\"", "\" id=\"error-message\">", "</p><button id=\"reset-errors\" style=\"", "\">Clear errors and retry</button><pre style=\"", "\">", "</pre></div></div>"];
function ErrorBoundary(props) {
  return createComponent(ErrorBoundary$1, {
    fallback: e => {
      return createComponent(Show, {
        get when() {
          return !props.fallback;
        },

        get fallback() {
          return props.fallback(e);
        },

        get children() {
          return createComponent(ErrorMessage, {
            error: e
          });
        }

      });
    },

    get children() {
      return props.children;
    }

  });
}

function ErrorMessage(props) {
  return ssr(_tmpl$$7, ssrHydrationKey(), "padding:" + "16px", "background-color:" + "rgba(252, 165, 165)" + (";color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";overflow:" + "scroll") + (";padding:" + "16px") + (";margin-bottom:" + "8px"), "font-weight:" + "bold", escape(props.error.message), "color:" + "rgba(252, 165, 165)" + (";background-color:" + "rgb(153, 27, 27)") + (";border-radius:" + "5px") + (";padding:" + "4px 8px"), "margin-top:" + "8px" + (";width:" + "100%"), escape(props.error.stack));
}

var global = '';

const _tmpl$$6 = ["<head><meta charset=\"utf-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><link rel=\"icon\" type=\"image/svg+xml\" href=\"/favicon/favicon.svg\"><link rel=\"icon\" type=\"image/png\" href=\"/favicon/favicon.png\"><link rel=\"preconnect\" href=\"https://fonts.googleapis.com\"><link rel=\"preconnect\" href=\"https://fonts.gstatic.com\"><link href=\"https://fonts.googleapis.com/css2?family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&amp;display=swap\" rel=\"stylesheet\">", "", "</head>"],
      _tmpl$2 = ["<html", " lang=\"en\">", "<body><!--#-->", "<!--/--><!--#-->", "<!--/--></body></html>"];
function Root() {
  return ssr(_tmpl$2, ssrHydrationKey(), NoHydration({
    get children() {
      return ssr(_tmpl$$6, escape(createComponent(Meta, {})), escape(createComponent(Links, {})));
    }

  }), escape(createComponent(ErrorBoundary, {
    get children() {
      return createComponent(Suspense, {
        get children() {
          return createComponent(Routes, {});
        }

      });
    }

  })), escape(createComponent(Scripts, {})));
}

const api = [
  {
    get: "skip",
    path: "/catering"
  },
  {
    get: "skip",
    path: "/contact"
  },
  {
    get: "skip",
    path: "/farmers-market"
  },
  {
    get: "skip",
    path: "/"
  }
];
function routeToMatchRoute(route) {
  const segments = route.path.split("/").filter(Boolean);
  const params = [];
  const matchSegments = [];
  let score = route.path.endsWith("/") ? 4 : 0;
  let wildcard = false;
  for (const [index, segment] of segments.entries()) {
    if (segment[0] === ":") {
      const name = segment.slice(1);
      score += 3;
      params.push({
        type: ":",
        name,
        index
      });
      matchSegments.push(null);
    } else if (segment[0] === "*") {
      params.push({
        type: "*",
        name: segment.slice(1),
        index
      });
      wildcard = true;
    } else {
      score += 4;
      matchSegments.push(segment);
    }
  }
  return {
    ...route,
    score,
    params,
    matchSegments,
    wildcard
  };
}
function getRouteMatches(routes, path, method) {
  const segments = path.split("/").filter(Boolean);
  routeLoop:
    for (const route of routes) {
      const matchSegments = route.matchSegments;
      if (segments.length < matchSegments.length || !route.wildcard && segments.length > matchSegments.length) {
        continue;
      }
      for (let index = 0; index < matchSegments.length; index++) {
        const match = matchSegments[index];
        if (!match) {
          continue;
        }
        if (segments[index] !== match) {
          continue routeLoop;
        }
      }
      const handler = route[method];
      if (handler === "skip" || handler === void 0) {
        return;
      }
      const params = {};
      for (const { type, name, index } of route.params) {
        if (type === ":") {
          params[name] = segments[index];
        } else {
          params[name] = segments.slice(index).join("/");
        }
      }
      return { handler, params };
    }
}
const allRoutes = api.map(routeToMatchRoute).sort((a, b) => b.score - a.score);
function getApiHandler(url, method) {
  return getRouteMatches(allRoutes, url.pathname, method.toLowerCase());
}

class FormError extends Error {
  constructor(message, {
    fieldErrors = {},
    form,
    fields,
    stack
  } = {}) {
    super(message);
    this.formError = message;
    this.name = "FormError";
    this.fields = fields || Object.fromEntries(typeof form !== "undefined" ? form.entries() : []) || {};
    this.fieldErrors = fieldErrors;

    if (stack) {
      this.stack = stack;
    }
  }

}

const XSolidStartLocationHeader = "x-solidstart-location";
const LocationHeader = "Location";
const ContentTypeHeader = "content-type";
const XSolidStartResponseTypeHeader = "x-solidstart-response-type";
const XSolidStartContentTypeHeader = "x-solidstart-content-type";
const XSolidStartOrigin = "x-solidstart-origin";
const JSONResponseType = "application/json";
const redirectStatusCodes = /* @__PURE__ */ new Set([204, 301, 302, 303, 307, 308]);
function isRedirectResponse(response) {
  return response && response instanceof Response && redirectStatusCodes.has(response.status);
}
class ResponseError extends Error {
  constructor(response) {
    let message = JSON.stringify({
      $type: "response",
      status: response.status,
      message: response.statusText,
      headers: [...response.headers.entries()]
    });
    super(message);
    this.name = "ResponseError";
    this.status = response.status;
    this.headers = new Map([...response.headers.entries()]);
    this.url = response.url;
    this.ok = response.ok;
    this.statusText = response.statusText;
    this.redirected = response.redirected;
    this.bodyUsed = false;
    this.type = response.type;
    this.response = () => response;
  }
  clone() {
    return this.response();
  }
  get body() {
    return this.response().body;
  }
  async arrayBuffer() {
    return await this.response().arrayBuffer();
  }
  async blob() {
    return await this.response().blob();
  }
  async formData() {
    return await this.response().formData();
  }
  async text() {
    return await this.response().text();
  }
  async json() {
    return await this.response().json();
  }
}
function respondWith(request, data, responseType) {
  if (data instanceof ResponseError) {
    data = data.clone();
  }
  if (data instanceof Response) {
    if (isRedirectResponse(data) && request.headers.get(XSolidStartOrigin) === "client") {
      let headers = new Headers(data.headers);
      headers.set(XSolidStartOrigin, "server");
      headers.set(XSolidStartLocationHeader, data.headers.get(LocationHeader));
      headers.set(XSolidStartResponseTypeHeader, responseType);
      headers.set(XSolidStartContentTypeHeader, "response");
      return new Response(null, {
        status: 204,
        headers
      });
    } else {
      data.headers.set(XSolidStartResponseTypeHeader, responseType);
      data.headers.set(XSolidStartContentTypeHeader, "response");
      return data;
    }
  } else if (data instanceof FormError) {
    return new Response(JSON.stringify({
      error: {
        message: data.message,
        stack: data.stack,
        formError: data.formError,
        fields: data.fields,
        fieldErrors: data.fieldErrors
      }
    }), {
      status: 400,
      headers: {
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "form-error"
      }
    });
  } else if (data instanceof Error) {
    return new Response(JSON.stringify({
      error: {
        message: data.message,
        stack: data.stack,
        status: data.status
      }
    }), {
      status: data.status || 500,
      headers: {
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "error"
      }
    });
  } else if (typeof data === "object" || typeof data === "string" || typeof data === "number" || typeof data === "boolean") {
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        [ContentTypeHeader]: "application/json",
        [XSolidStartResponseTypeHeader]: responseType,
        [XSolidStartContentTypeHeader]: "json"
      }
    });
  }
  return new Response("null", {
    status: 200,
    headers: {
      [ContentTypeHeader]: "application/json",
      [XSolidStartContentTypeHeader]: "json",
      [XSolidStartResponseTypeHeader]: responseType
    }
  });
}

const server = (fn) => {
  throw new Error("Should be compiled away");
};
async function parseRequest(request) {
  let contentType = request.headers.get(ContentTypeHeader);
  let name = new URL(request.url).pathname, args = [];
  if (contentType) {
    if (contentType === JSONResponseType) {
      let text = await request.text();
      try {
        args = JSON.parse(text, (key, value) => {
          if (!value) {
            return value;
          }
          if (value.$type === "headers") {
            let headers = new Headers();
            request.headers.forEach((value2, key2) => headers.set(key2, value2));
            value.values.forEach(([key2, value2]) => headers.set(key2, value2));
            return headers;
          }
          if (value.$type === "request") {
            return new Request(value.url, {
              method: value.method,
              headers: value.headers
            });
          }
          return value;
        });
      } catch (e) {
        throw new Error(`Error parsing request body: ${text}`);
      }
    } else if (contentType.includes("form")) {
      let formData = await request.formData();
      args = [formData];
    }
  }
  return [name, args];
}
async function handleServerRequest(ctx) {
  const url = new URL(ctx.request.url);
  if (server.hasHandler(url.pathname)) {
    try {
      let [name, args] = await parseRequest(ctx.request);
      let handler = server.getHandler(name);
      if (!handler) {
        throw {
          status: 404,
          message: "Handler Not Found for " + name
        };
      }
      const data = await handler.call(ctx, ...Array.isArray(args) ? args : [args]);
      return respondWith(ctx.request, data, "return");
    } catch (error) {
      return respondWith(ctx.request, error, "throw");
    }
  }
  return null;
}
const handlers = /* @__PURE__ */ new Map();
server.createHandler = (_fn, hash) => {
  let fn = function(...args) {
    let ctx;
    if (typeof this === "object" && this.request instanceof Request) {
      ctx = this;
    } else if (sharedConfig.context && sharedConfig.context.requestContext) {
      ctx = sharedConfig.context.requestContext;
    } else {
      ctx = {
        request: new URL(hash, "http://localhost:3000").href,
        responseHeaders: new Headers()
      };
    }
    const execute = async () => {
      try {
        let e = await _fn.call(ctx, ...args);
        return e;
      } catch (e) {
        if (/[A-Za-z]+ is not defined/.test(e.message)) {
          const error = new Error(e.message + "\n You probably are using a variable defined in a closure in your server function.");
          error.stack = e.stack;
          throw error;
        }
        throw e;
      }
    };
    return execute();
  };
  fn.url = hash;
  fn.action = function(...args) {
    return fn.call(this, ...args);
  };
  return fn;
};
server.registerHandler = function(route, handler) {
  handlers.set(route, handler);
};
server.getHandler = function(route) {
  return handlers.get(route);
};
server.hasHandler = function(route) {
  return handlers.has(route);
};
server.fetch = async function(route, init) {
  let url = new URL(route, "http://localhost:3000");
  const request = new Request(url.href, init);
  const handler = getApiHandler(url, request.method);
  const response = await handler.handler({ request }, handler.params);
  return response;
};

const inlineServerFunctions = ({ forward }) => {
  return async (ctx) => {
    const url = new URL(ctx.request.url);
    if (server.hasHandler(url.pathname)) {
      let contentType = ctx.request.headers.get("content-type");
      let origin = ctx.request.headers.get("x-solidstart-origin");
      let formRequestBody;
      if (contentType != null && contentType.includes("form") && !(origin != null && origin.includes("client"))) {
        let [read1, read2] = ctx.request.body.tee();
        formRequestBody = new Request(ctx.request.url, {
          body: read2,
          headers: ctx.request.headers,
          method: ctx.request.method
        });
        ctx.request = new Request(ctx.request.url, {
          body: read1,
          headers: ctx.request.headers,
          method: ctx.request.method
        });
      }
      const serverResponse = await handleServerRequest(ctx);
      let responseContentType = serverResponse.headers.get("x-solidstart-content-type");
      if (formRequestBody && responseContentType !== null && responseContentType.includes("error")) {
        const formData = await formRequestBody.formData();
        let entries = [...formData.entries()];
        return new Response(null, {
          status: 302,
          headers: {
            Location: new URL(ctx.request.headers.get("referer")).pathname + "?form=" + encodeURIComponent(JSON.stringify({
              url: url.pathname,
              entries,
              ...await serverResponse.json()
            }))
          }
        });
      }
      return serverResponse;
    }
    const response = await forward(ctx);
    if (ctx.responseHeaders.get("x-solidstart-status-code")) {
      return new Response(response.body, {
        status: parseInt(ctx.responseHeaders.get("x-solidstart-status-code")),
        headers: response.headers
      });
    }
    return response;
  };
};

const apiRoutes = ({ forward }) => {
  return async (ctx) => {
    let apiHandler = getApiHandler(new URL(ctx.request.url), ctx.request.method);
    if (apiHandler) {
      return await apiHandler.handler(ctx, apiHandler.params);
    }
    return await forward(ctx);
  };
};

const rootData = Object.values({})[0];
const dataFn = rootData ? rootData.default : undefined;
/** Function responsible for listening for streamed [operations]{@link Operation}. */

/** This composes an array of Exchanges into a single ExchangeIO function */
const composeMiddleware = exchanges => ({
  ctx,
  forward
}) => exchanges.reduceRight((forward, exchange) => exchange({
  ctx: ctx,
  forward
}), forward);
function createHandler(...exchanges) {
  const exchange = composeMiddleware([apiRoutes, inlineServerFunctions, ...exchanges]);
  return async request => {
    return await exchange({
      ctx: {
        request
      },
      // fallbackExchange
      forward: async op => {
        return new Response(null, {
          status: 404
        });
      }
    })(request);
  };
}
const docType = ssr("<!DOCTYPE html>");
var StartServer = (({
  context
}) => {
  let pageContext = context;
  pageContext.routerContext = {};
  pageContext.tags = [];

  pageContext.setStatusCode = code => {
    pageContext.responseHeaders.set("x-solidstart-status-code", code.toString());
  };

  pageContext.setHeader = (name, value) => {
    pageContext.responseHeaders.set(name, value.toString());
  }; // @ts-expect-error


  sharedConfig.context.requestContext = context;
  const parsed = new URL(context.request.url);
  const path = parsed.pathname + parsed.search;
  return createComponent(StartProvider, {
    context: pageContext,

    get children() {
      return createComponent(MetaProvider, {
        get tags() {
          return pageContext.tags;
        },

        get children() {
          return createComponent(Router, {
            url: path,

            get out() {
              return pageContext.routerContext;
            },

            data: dataFn,

            get children() {
              return [docType, createComponent(Root, {})];
            }

          });
        }

      });
    }

  });
});

var entryServer = createHandler(renderAsync(context => createComponent(StartServer, {
  context: context
})));

const root = "_root_1qiqm_1";
const head = "_head_1qiqm_9";
const selectedTab = "_selectedTab_1qiqm_42";
const logo = "_logo_1qiqm_47";
const decoration = "_decoration_1qiqm_52";
var styles$3 = {
	root: root,
	head: head,
	selectedTab: selectedTab,
	logo: logo,
	decoration: decoration
};

const _tmpl$$5 = ["<div", "><div", "><img src=\"/images/decorations/nav-top.svg\"", "><img src=\"/images/full-logo.svg\"", "><nav><!--#-->", "<!--/--><!--#-->", "<!--/--><!--#-->", "<!--/--><!--#-->", "<!--/--></nav><div></div><img src=\"/images/decorations/nav-bottom.svg\"", "></div><main", ">", "</main></div>"];
function Layout(props) {
  return ssr(_tmpl$$5, ssrHydrationKey() + ssrAttribute("class", escape(styles$3.root, true), false), ssrAttribute("class", escape(styles$3.head, true), false), ssrAttribute("class", escape(styles$3.decoration, true), false), ssrAttribute("class", escape(styles$3.logo, true), false), escape(createComponent(NavLink, {
    href: "/",

    get activeClass() {
      return styles$3.selectedTab;
    },

    end: true,
    children: "Home"
  })), escape(createComponent(NavLink, {
    href: "/catering",

    get activeClass() {
      return styles$3.selectedTab;
    },

    children: "Catering"
  })), escape(createComponent(NavLink, {
    href: "/farmers-market",

    get activeClass() {
      return styles$3.selectedTab;
    },

    children: "Farmers' Market"
  })), escape(createComponent(NavLink, {
    href: "/contact",

    get activeClass() {
      return styles$3.selectedTab;
    },

    children: "Contact"
  })), ssrAttribute("class", escape(styles$3.decoration, true), false), ssrAttribute("class", escape(styles$3.main, true), false), escape(props.children));
}

const sections$1 = "_sections_19dvc_1";
const section$1 = "_section_19dvc_1";
const one$1 = "_one_19dvc_8";
const two$1 = "_two_19dvc_12";
const cards$1 = "_cards_19dvc_15";
const three$1 = "_three_19dvc_20";
const divider$1 = "_divider_19dvc_35";
var index_module = {
	sections: sections$1,
	section: section$1,
	one: one$1,
	two: two$1,
	cards: cards$1,
	three: three$1,
	divider: divider$1
};

const _tmpl$$4 = ["<h2", ">Coming Soon...</h2>"];
function Home$3() {
  return createComponent(Layout, {
    get children() {
      return ssr(_tmpl$$4, ssrHydrationKey());
    }

  });
}

var catering = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  'default': Home$3
}, Symbol.toStringTag, { value: 'Module' }));

const contact$1 = "_contact_1d9rk_1";
var styles$2 = {
	contact: contact$1
};

const _tmpl$$3 = ["<div", "><h2>Contact</h2><h4>Contact me at<br><a href=\"mailto:oliver@tuxedocupcakes.com\" target=\"_blank\" rel=\"noopener noreferrer\">oliver@tuxedocupcakes.com</a></h4></div>"];
function Home$2() {
  return createComponent(Layout, {
    get children() {
      return ssr(_tmpl$$3, ssrHydrationKey() + ssrAttribute("class", escape(styles$2.contact, true), false));
    }

  });
}

var contact = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  'default': Home$2
}, Symbol.toStringTag, { value: 'Module' }));

const _tmpl$$2 = ["<h2", ">Coming Soon...</h2>"];
function Home$1() {
  return createComponent(Layout, {
    get children() {
      return ssr(_tmpl$$2, ssrHydrationKey());
    }

  });
}

var farmersMarket = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  'default': Home$1
}, Symbol.toStringTag, { value: 'Module' }));

const cardLink = "_cardLink_1q6o1_1";
const card = "_card_1q6o1_1";
const outline = "_outline_1q6o1_31";
const top = "_top_1q6o1_36";
const bottom = "_bottom_1q6o1_39";
var styles$1 = {
	cardLink: cardLink,
	card: card,
	outline: outline,
	top: top,
	bottom: bottom
};

const _tmpl$$1 = ["<div", "><h3>", "</h3><p>", "</p><img src=\"/images/decorations/card-outline-top.svg\" class=\"", "\"><img src=\"/images/decorations/card-outline-bottom.svg\" class=\"", "\"></div>"];
function Card(props) {
  return createComponent(Link, {
    get href() {
      return props.link || "#";
    },

    get ["class"]() {
      return styles$1.cardLink;
    },

    get children() {
      return ssr(_tmpl$$1, ssrHydrationKey() + ssrAttribute("class", escape(styles$1.card, true), false), escape(props.title), escape(props.children), `${escape(styles$1.outline, true)} ${escape(styles$1.top, true)}`, `${escape(styles$1.outline, true)} ${escape(styles$1.bottom, true)}`);
    }

  });
}

const sections = "_sections_19dvc_1";
const section = "_section_19dvc_1";
const one = "_one_19dvc_8";
const two = "_two_19dvc_12";
const cards = "_cards_19dvc_15";
const three = "_three_19dvc_20";
const divider = "_divider_19dvc_35";
var styles = {
	sections: sections,
	section: section,
	one: one,
	two: two,
	cards: cards,
	three: three,
	divider: divider
};

const _tmpl$ = ["<div", "><div class=\"", "\"><h2>A More Sophisticated Cupcake</h2><p>Tuxedo Cupcakes aims to make a cupcake that kids and adults alike can enjoy. <br> With the perfect balance of sweetness and bold flavors, Tuxedo Cupcakes uses the best ingredients to make the best cupcakes.</p></div><img src=\"/images/decorations/bow-divider.svg\"", "><div class=\"", "\"><h2>How to get Tuxedo Cupcakes</h2><div", "><!--#-->", "<!--/--><!--#-->", "<!--/--></div></div><img src=\"/images/decorations/bow-divider.svg\"", "><div class=\"", "\"><h2>Contact</h2><h4>Contact me at<br><a href=\"mailto:oliver@tuxedocupcakes.com\" target=\"_blank\" rel=\"noopener noreferrer\">oliver@tuxedocupcakes.com</a></h4></div></div>"];
function Home() {
  return createComponent(Layout, {
    get children() {
      return ssr(_tmpl$, ssrHydrationKey() + ssrAttribute("class", escape(styles.sections, true), false), `${escape(styles.section, true)} ${escape(styles.one, true)}`, ssrAttribute("class", escape(styles.divider, true), false), `${escape(styles.section, true)} ${escape(styles.two, true)}`, ssrAttribute("class", escape(styles.cards, true), false), escape(createComponent(Card, {
        title: "Catering",
        link: "/catering",
        children: "I can provide your event with a cake or cupcakes that will make it memorable"
      })), escape(createComponent(Card, {
        title: "Farmers' Market",
        link: "/farmers-market",
        children: "I attend the Chatham Farmers\u2019 Market on Saturdays, where you can choose from a selection of cupcakes I have avaliable that day"
      })), ssrAttribute("class", escape(styles.divider, true), false), `${escape(styles.section, true)} ${escape(styles.three, true)}`);
    }

  });
}

var index = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  'default': Home
}, Symbol.toStringTag, { value: 'Module' }));

export { entryServer as default };
