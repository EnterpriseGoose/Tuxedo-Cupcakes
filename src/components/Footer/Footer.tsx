import {NavLink} from '@solidjs/router'
import styles from "./Footer.module.scss";

export default function Footer(props?: {children?: any, title?: string}) {
  return (
    <div class={styles.footer}>
			<img src="/images/decorations/footer-decoration.svg" class={styles.decoration} draggable={false} />
      <div class={styles.links}>
				<div class={styles.left}>
					<NavLink href="/" activeClass={styles.selectedTab} end={true} draggable={false}>Home</NavLink>
          <NavLink href="/catering" activeClass={styles.selectedTab} draggable={false}>Catering</NavLink>
				</div>
				<img src="/images/logo.svg" draggable={false} />
				<div class={styles.right}>
					<NavLink href="/farmers-market" activeClass={styles.selectedTab} draggable={false}>Farmers' Market</NavLink>
          <NavLink href="/contact" activeClass={styles.selectedTab} draggable={false}>Contact</NavLink>
				</div>
			</div>
    </div>
  );
}
