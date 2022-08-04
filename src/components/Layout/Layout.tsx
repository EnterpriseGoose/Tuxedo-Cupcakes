import {NavLink} from 'solid-app-router'
import styles from "./Layout.module.scss";

export default function Layout(props?: {children?: any;}) {
  return (
    <div class={styles.root}>
      <div class={styles.head}>
        <img src="/images/decorations/nav-top.svg" class={styles.decoration} />
        <img src="/images/full-logo.svg" class={styles.logo} />
        <nav>
          <NavLink href="/" activeClass={styles.selectedTab} end={true}>Home</NavLink>
          <NavLink href="/catering" activeClass={styles.selectedTab}>Catering</NavLink>
          <NavLink href="/farmers-market" activeClass={styles.selectedTab}>Farmers' Market</NavLink>
          <NavLink href="/contact" activeClass={styles.selectedTab}>Contact</NavLink>
        </nav>
				<div/>
        <img
          src="/images/decorations/nav-bottom.svg"
          class={styles.decoration}
        />
      </div>
      <main class={styles.main}>{props.children}</main>
    </div>
  );
}
