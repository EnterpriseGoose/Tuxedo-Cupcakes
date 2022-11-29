import { onMount } from 'solid-js';
import { useSearchParams } from 'solid-start';
import Layout from '~/components/Layout';

import styles from './catering.module.scss';

export default function Catering() {
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Catering of Cakes and Cupcakes</h2>
          <p>
            I can cater your event with a custom cake or cupcakes! I’m able to
            do most flavors you could imagine, I specialize in using fresh,
            seasonal fruit to make decorative and super tasty cakes and
            cupcakes.
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>How to Order</h3>
          <p>
            To inquire about an order, send an email to{' '}
            <a
              class={styles.email}
              href="mailto:oliver@tuxedocupcakes.com?subject=Catering%20Order"
              target="_blank"
              rel="noopener noreferrer"
            >
              oliver@tuxedocupcakes.com
            </a>
            <br />I can help you figure out the details about flavors or
            decorations, as well as the size of the cake or quantity of cupcakes
            and the price.
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.three}`}>
          <h2>Past Cakes</h2>
          <p>Here are some of the cakes I’ve made in the past:</p>
          <div class={styles.images}>
            <div class={styles.image}>
              <img src="/images/cake-1.png" />
              <p>2 layer lemon, peach and blueberry cake</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cake-2.png" />
              <p>3 layer cake themed to look like an easter basket</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cake-3.png" />
              <p>12 layer sponge cake with fruit and other fillings</p>
            </div>
          </div>
        </div>
        <div class={`${styles.section} ${styles.four}`}>
          <h2>Cupcakes</h2>
          <p>
            Here are some of the cupcakes I sell at the Farmers’ Market and
            would be happy to do catering for (I can also do custom flavors)
          </p>
          <div class={styles.images}>
            <div class={styles.image}>
              <img src="/images/cupcake-1.png" />
              <p>Chocolate Peanut Butter Mini Cupcake</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cupcake-2.png" />
              <p>Mint Chocolate Chip Mini Cupcake</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cupcake-3.png" />
              <p>Chocolate Chocolate Mini Cupcake</p>
            </div>
          </div>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.five}`}>
          <h2>Pricing</h2>
          <p>
            In the end, pricing has to be done per-order, but I can give a
            general idea of how much basic cakes and cupcakes cost
            <br />
          </p>
          <h4>Cakes:</h4>
          <p>
            9 in. 1 layer cake (serves 5-8): $30
            <br />
            9 in. 2 layer cake (serves 10-16): $50
            <br />
            9 in. 3 layer cake (serves 16-28): $70
            <br />
            <br />
            I can also make other sizes on request
            <br />
          </p>
          <h4>Cupcakes (discounts for bulk orders):</h4>
          <p>
            12 classic cupcakes (vanilla, chocolate): $35
            <br />
            12 special cupcakes (other flavors): $40
            <br />
            12 mini cupcakes (any flavor): $20
            <br />
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.six}`}>
          <h3>Order</h3>
          <h4>
            Contact me about catering at
            <br />
            <a
              href="mailto:oliver@tuxedocupcakes.com?subject=Catering%20Order"
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
