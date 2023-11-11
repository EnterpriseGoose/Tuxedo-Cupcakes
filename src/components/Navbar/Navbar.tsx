import { useSearchParams } from '@solidjs/router';
import { A } from 'solid-start';
import styles from './Navbar.module.scss';

let previousLayout = undefined;

export default function Navbar(props?: { home?: any }) {
  const [searchParams, setSearchparams] = useSearchParams();

  let home = props.home;
  if (home === undefined) home = false;
  let logoTransition = home ? styles.bigLogo : styles.smallLogo;
  if (previousLayout === undefined || searchParams.p === 'm') {
    console.log('First rendering of layout');
  } else {
    console.log(`Going from layout ${previousLayout} to layout ${home}`);
    if (previousLayout && !home) {
      logoTransition = styles.toSmallLogo;
    } else if (!previousLayout && home) {
      logoTransition = styles.toBigLogo;
    }
  }
  previousLayout = home;

  return (
    <div class={styles.head}>
      <img
        src="/images/decorations/nav-top.svg"
        class={`${styles.decoration} ${logoTransition}`}
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
          class={`${logoTransition} ${styles.logo}`}
          draggable={false}
          alt="Tuxedo Cupcakes Logo"
          width="600"
          height="150"
        />
      </A>

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
          href="/sweet-16/"
          activeClass={styles.selectedTab}
          draggable={false}
          noScroll={true}
        >
          Sweet 16
        </A>{/*
        <A
          href="/virtual-market"
          activeClass={styles.selectedTab}
          draggable={false}
          noScroll={true}
        >
          Virtual Market
	</A>*/}
        <A
          href="/contact"
          activeClass={styles.selectedTab}
          draggable={false}
          noScroll={true}
        >
          Contact
        </A>
      </nav>
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
}
