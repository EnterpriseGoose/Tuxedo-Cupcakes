import { NavLink, useSearchParams } from '@solidjs/router';
import { createSignal, onMount } from 'solid-js';
import Footer from '../Footer';
import Navbar from '../Navbar';
import styles from './Layout.module.scss';

export default function Layout(props?: { children?: any; home?: any }) {
  let footerRef;
  onMount(() => {
    const [searchParams, setSearchparams] = useSearchParams();
    if (searchParams.p === 'b') {
      footerRef.scrollIntoView();
    }
  });

  return (
    <div class={styles.root}>
      <Navbar home={props.home} />
      <main class={styles.main}>{props.children}</main>
      <Footer ref={footerRef} />
    </div>
  );
}
