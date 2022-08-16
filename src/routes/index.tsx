import Layout from '~/components/Layout';
import Card from '~/components/Card';

import styles from './index.module.scss';

export default function Home() {
  return (
    <Layout home={true}>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>A More Sophisticated Cupcake</h2>
          <p>
            Tuxedo Cupcakes aims to make a cupcake that kids and adults alike
            can enjoy. <br /> With the perfect balance of sweetness and bold
            flavors, Tuxedo Cupcakes uses the best ingredients to make the best
            cupcakes.
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.two}`}>
          <h2>How to get Tuxedo Cupcakes</h2>
          <div class={styles.cards}>
            <Card title="Catering" link="/catering">
              I can provide your event with a cake or cupcakes that will make it
              memorable
            </Card>
            <Card title="Farmers' Market" link="/farmers-market">
              I attend the Chatham Farmers’ Market on Saturdays, where you can
              choose from a selection of cupcakes I have avaliable that day
            </Card>
          </div>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.three}`}>
          <h2>Contact</h2>
          <h4>
            Contact me at
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
