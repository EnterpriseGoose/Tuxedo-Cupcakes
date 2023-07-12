import { NavLink, useSearchParams } from '@solidjs/router';
import { Show, createSignal, onMount } from 'solid-js';
import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './Layout.module.scss';

export default function Layout(props?: {
  children?: any;
  home?: any;
  hideFooter?: boolean;
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
      <Navbar home={props.home} />
      <main class={styles.main}>{props.children}</main>
      <Show when={!props.hideFooter}>
        <Footer ref={footerRef} />
      </Show>
    </div>
  );
}
