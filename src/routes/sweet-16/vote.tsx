import Layout from '~/components/Layout';
import styles from './vote.module.scss';
import { A } from 'solid-start';

export default function Vote() {
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Sweet 16 Voting</h2>
          <p>
            Voting for this week's Sweet 16 match will open soon (Sunday afternoon). Check back then to vote on your favorite flavor!
						<br /> <br />
						For more information about the Sweet 16 Cupcake Bracket, check out <A href='/sweet-16'>this page</A>
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}></div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.four}`}>
          <h4>
            Any questions? Contact me at
            <br />
            <a
              href="mailto:oliver@tuxedocupcakes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              oliver@tuxedocupcakes.com
            </a>
          </h4>
        </div>
      </div>
    </Layout>
  );
}
