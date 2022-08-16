import { NavLink } from '@solidjs/router';
import Footer from '../Footer';
import styles from './Layout.module.scss';

let previousLayout = undefined;

export default function Layout(props?: { children?: any; home?: any }) {
  if (props.home === undefined) props.home = false;
  let logoTransition = props.home ? styles.bigLogo : styles.smallLogo;
  if (previousLayout === undefined) {
    console.log('First rendering of layout');
  } else {
    console.log(`Going from layout ${previousLayout} to layout ${props.home}`);
    if (previousLayout === true && props.home === false) {
      logoTransition = styles.toSmallLogo;
    } else if (previousLayout === false && props.home === true) {
      logoTransition = styles.toBigLogo;
    }
  }
  previousLayout = props.home;

  return (
    <div class={styles.root}>
      <div class={styles.head}>
        <img
          src="/images/decorations/nav-top.svg"
          class={`${styles.decoration} ${logoTransition}`}
          draggable={false}
        />
        <img
          src="/images/full-logo.svg"
          class={`${logoTransition} ${styles.logo}`}
          draggable={false}
        />
        <nav>
          <NavLink
            href="/"
            activeClass={styles.selectedTab}
            end={true}
            draggable={false}
          >
            Home
          </NavLink>
          <NavLink
            href="/catering"
            activeClass={styles.selectedTab}
            draggable={false}
          >
            Catering
          </NavLink>
          <NavLink
            href="/farmers-market"
            activeClass={styles.selectedTab}
            draggable={false}
          >
            Farmers' Market
          </NavLink>
          <NavLink
            href="/contact"
            activeClass={styles.selectedTab}
            draggable={false}
          >
            Contact
          </NavLink>
        </nav>
        <div />
        <img
          src="/images/decorations/nav-bottom.svg"
          class={styles.decoration}
          draggable={false}
        />
      </div>
      <main class={styles.main}>{props.children}</main>
      <Footer />
    </div>
  );
}
