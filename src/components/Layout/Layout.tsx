import { NavLink, useSearchParams } from '@solidjs/router';
import { Show, createSignal, onMount } from 'solid-js';
import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './Layout.module.scss';
import { Head } from 'solid-start';

export default function Layout(props?: {
  children?: any;
  home?: boolean;
  hideFooter?: boolean;
  desc?: string;
  mini?: boolean;
}) {
  let footerRef;
  onMount(() => {
    const [searchParams, setSearchparams] = useSearchParams();
    if (searchParams.p === 'b' && footerRef) {
      footerRef.scrollIntoView();
    }
    setSearchparams({ p: undefined });
  });

  return (
    <div class={styles.root}>
      <Head>
        <meta
          name="description"
          content={
            props.desc ||
            'Tuxedo Cupcakes is a small bakery based in Chatham, NJ that aims to make the best cupcakes that have just the right balance of sweetness and bold flavors.'
          }
        />
      </Head>
      <Navbar mini={props.mini} home={props.home} />
      <main class={`${styles.main} ${props.mini ? styles.mini : ''}`}>
        {props.children}
      </main>
      <Show when={!props.hideFooter}>
        <Footer ref={footerRef} />
      </Show>
    </div>
  );
}
