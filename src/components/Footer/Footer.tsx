import { A } from '@solidjs/router';
import styles from './Footer.module.scss';

export default function Footer(props?: {
  children?: any;
  title?: string;
  ref?: any;
}) {
  return (
    <div class={styles.footer} ref={props.ref}>
      <img
        src="/images/decorations/footer-decoration.svg"
        class={styles.decoration}
        draggable={false}
        alt=""
      />
      <div class={styles.links}>
        <div class={styles.left}>
          <A
            href="/?p=b"
            activeClass={styles.selectedTab}
            end={true}
            draggable={false}
            noScroll={true}
          >
            Home
          </A>
          <A
            href="/catering?p=b"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
          >
            Catering
          </A>
        </div>
        <img src="/images/logo.svg" draggable={false} alt="" />
        <div class={styles.right}>
          <A
            href="/farmers-market?p=b"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
          >
            Farmers' Market
          </A>
          <A
            href="/contact?p=b"
            activeClass={styles.selectedTab}
            draggable={false}
            noScroll={true}
          >
            Contact
          </A>
        </div>
      </div>
    </div>
  );
}
