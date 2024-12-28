import { A, useSearchParams } from '@solidjs/router';
import styles from './Navbar.module.scss';
import { createSignal, onMount, Show } from 'solid-js';

let previousLayout = undefined;

export default function Navbar(props?: {
  home?: boolean;
  mini?: boolean;
  minimal?: boolean;
  notModern?: boolean;
}) {
  const [searchParams, setSearchparams] = useSearchParams();
  const [flyoutHidden, setFlyoutHidden] = createSignal(true);

  let home = props.home || false;
  let mini = props.mini || props.minimal || true;

  let newLayout = 'regular';
  let baseStyle = styles.regularLogo;
  let logoTransition = '';
  if (home) {
    newLayout = 'home';
    baseStyle = styles.bigLogo;
  }
  if (mini) {
    newLayout = 'mini';
    baseStyle = styles.miniLogo;
  }
  if (
    previousLayout === undefined ||
    searchParams.p === 'm' ||
    previousLayout === newLayout
  ) {
    console.log(
      previousLayout
        ? `First rendering of layout`
        : `${previousLayout} === ${newLayout}`
    );
  } else {
    baseStyle = styles.regularLogo;
    logoTransition = styles.toRegularLogo;

    if (previousLayout === 'home') {
      baseStyle = styles.bigLogo;
    }
    if (previousLayout === 'mini') {
      baseStyle = styles.miniLogo;
    }
    if (home) {
      logoTransition = styles.toBigLogo;
    }
    if (mini) {
      logoTransition = styles.toMiniLogo;
    }

    console.log(`Going from layout ${previousLayout} to layout ${newLayout}`);
  }
  previousLayout = newLayout;

  if (props.notModern)
    return (
      <div class={styles.head}>
        {/* <A href="/order" draggable={false} noScroll={true}>
        <div class={`${styles.banner} ${baseStyle} ${logoTransition}`}>
          Click here to place an order today for our February 24th pop up!
        </div>{' '}
      </A> */}
        <img
          src="/images/decorations/nav-top.svg"
          class={`${styles.decoration} ${baseStyle} ${logoTransition}`}
          draggable={false}
          alt=""
          width="900"
          height="80"
        />
        <A
          href="/"
          activeClass={styles.selectedTab}
          end={true}
          draggable={false}
          noScroll={true}
        >
          <img
            src="/images/full-logo.svg"
            class={`${baseStyle} ${logoTransition} ${styles.logo}`}
            draggable={false}
            alt="Tuxedo Cupcakes Logo"
            width="600"
            height="150"
          />
        </A>

        <Show when={!props.minimal}>
          <nav>
            <A
              href="/"
              activeClass={styles.selectedTab}
              end={true}
              draggable={false}
              noScroll={true}
            >
              Home
            </A>
            <A
              href="/order/"
              activeClass={styles.selectedTab}
              draggable={false}
              noScroll={true}
            >
              Order
            </A>
            <A
              href="/catering"
              activeClass={styles.selectedTab}
              draggable={false}
              noScroll={true}
            >
              Catering
            </A>
            <A
              href="/farmers-market/"
              activeClass={styles.selectedTab}
              draggable={false}
              noScroll={true}
            >
              Farmers' Market
            </A>
            <A
              href="/flavors"
              activeClass={styles.selectedTab}
              draggable={false}
              noScroll={true}
            >
              Flavors
            </A>
            <A
              href="/contact"
              activeClass={styles.selectedTab}
              draggable={false}
              noScroll={true}
            >
              Contact
            </A>
            <div class={styles.socialLinkBox}>
              <a
                href="https://www.instagram.com/tuxedo_cupcakes/"
                target="_blank"
                rel="noopener noreferrer"
                class={styles.socialLink}
              >
                <img src="/images/instagram-logo.svg" width={50} height={50} />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=61555665201272"
                target="_blank"
                rel="noopener noreferrer"
                class={styles.socialLink}
              >
                <img src="/images/facebook-logo.svg" width={50} height={50} />
              </a>
            </div>
          </nav>
        </Show>
        <div />
        <img
          src="/images/decorations/nav-bottom.svg"
          class={`${styles.decoration} ${styles.bottom}`}
          draggable={false}
          alt=""
          width="900"
          height="80"
        />
      </div>
    );
  else
    return (
      <div class={styles.mhead}>
        <A
          href="/"
          activeClass={styles.selectedTab}
          end={true}
          draggable={false}
          noScroll={true}
        >
          <img
            src="/images/full-logo-dark.svg"
            class={`${baseStyle} ${logoTransition} ${styles.logo}`}
            draggable={false}
            alt="Tuxedo Cupcakes Logo"
            width="600"
            height="150"
          />
        </A>

        <nav>
          <A
            href="/catering"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
            class={styles.desktop}
          >
            Catering
          </A>
          <A
            href="/farmers-market/"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
            class={styles.desktop}
          >
            Farmers' Market
          </A>
          <A
            href="/flavors"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
            class={styles.desktop}
          >
            Flavors
          </A>
          <A
            href="/contact"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
            class={styles.desktop}
          >
            Contact
          </A>
          <A
            href="/order/"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
            class={styles.order}
          >
            Order
          </A>
          <div class={`${styles.menu} ${styles.mobile}`}>
            <svg
              width="173"
              height="144"
              viewBox="0 0 173 144"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              onclick={() => {
                setFlyoutHidden(!flyoutHidden());
              }}
            >
              <path
                d="M12 12H161"
                stroke="black"
                stroke-width="24"
                stroke-linecap="round"
              />
              <path
                d="M12 72H161"
                stroke="black"
                stroke-width="24"
                stroke-linecap="round"
              />
              <path
                d="M12 132H161"
                stroke="black"
                stroke-width="24"
                stroke-linecap="round"
              />
            </svg>
            <div
              class={`${styles.background} ${
                flyoutHidden() ? styles.hidden : ''
              }`}
              onclick={() => {
                setFlyoutHidden(true);
              }}
            ></div>
            <div
              class={`${styles.flyout} ${flyoutHidden() ? styles.hidden : ''}`}
            >
              <svg
                width="116"
                height="117"
                viewBox="0 0 116 117"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onclick={() => {
                  setFlyoutHidden(true);
                }}
              >
                <path
                  d="M8.00244 8.29541L107.705 107.997"
                  stroke="black"
                  stroke-width="16"
                  stroke-linecap="round"
                />
                <path
                  d="M107.705 9.00244L8.00253 108.704"
                  stroke="black"
                  stroke-width="16"
                  stroke-linecap="round"
                />
              </svg>
              <A
                href="/order"
                activeClass={styles.selectedTab}
                draggable={false}
                noScroll={true}
              >
                Order
              </A>
              <A
                href="/catering"
                activeClass={styles.selectedTab}
                draggable={false}
                noScroll={true}
              >
                Catering
              </A>
              <A
                href="/farmers-market/"
                activeClass={styles.selectedTab}
                draggable={false}
                noScroll={true}
              >
                Farmers' Market
              </A>
              <A
                href="/flavors"
                activeClass={styles.selectedTab}
                draggable={false}
                noScroll={true}
              >
                Flavors
              </A>
              <A
                href="/contact"
                activeClass={styles.selectedTab}
                draggable={false}
                noScroll={true}
              >
                Contact
              </A>
            </div>
          </div>
        </nav>

        <div />
      </div>
    );
}
