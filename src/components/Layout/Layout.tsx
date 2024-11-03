import { useSearchParams } from '@solidjs/router';
import { Show, onMount } from 'solid-js';
import { MetaProvider, Meta } from '@solidjs/meta';
import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './Layout.module.scss';

export default function Layout(props?: {
  children?: any;
  home?: boolean;
  hideFooter?: boolean;
  desc?: string;
  mini?: boolean;
  minimal?: boolean;
  noOverflow?: boolean;
}) {
  let footerRef;
  onMount(() => {
    const [searchParams, setSearchparams] = useSearchParams();
    if (searchParams.p === 'b' && footerRef) {
      footerRef.scrollIntoView();
    }
    setSearchparams({ p: undefined });

    document.body.style.overflow = props.noOverflow ? 'hidden' : '';
  });

  console.log(props);

  return (
    <div class={styles.root} id="root">
      <MetaProvider>
        <Meta
          name="description"
          content={
            props.desc ||
            'Tuxedo Cupcakes is a small bakery based in Chatham, NJ that aims to make the best cupcakes that have just the right balance of sweetness and bold flavors.'
          }
        />
      </MetaProvider>
      <Navbar mini={props.mini} home={props.home} minimal={props.minimal} />
      <main class={`${styles.main} ${props.mini ? styles.mini : ''}`}>
        {props.children}
      </main>
      <Show when={!props.hideFooter && !props.minimal}>
        <Footer ref={footerRef} />
      </Show>
    </div>
  );
}
