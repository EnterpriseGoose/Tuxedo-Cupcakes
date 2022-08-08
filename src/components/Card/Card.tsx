import {Link} from '@solidjs/router'
import styles from "./Card.module.scss";

export default function Card(props?: {children?: any, title?: string, link?: string}) {
  return (
    <Link href={props.link || "#"} class={styles.cardLink}>
      <div class={styles.card}>
        <h3>{props.title}</h3>
        <p>{props.children}</p>
        <img src="/images/decorations/card-outline-top.svg" class={`${styles.outline} ${styles.top}`} />
        <img src="/images/decorations/card-outline-bottom.svg" class={`${styles.outline} ${styles.bottom}`} />
      </div>
    </Link>
  );
}
