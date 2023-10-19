import Layout from '~/components/Layout';

import styles from './catering.module.scss';
import { A } from 'solid-start';

export default function Catering() {
  return (
    <Layout desc="Tuxedo Cupcakes can cater your event with a custom cake or cupcakes to make it memorable. Tuxedo Cupcakes specializes in making super tasty creations that have bold flavors with just the right amount of sweetness.">
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Catering of Cakes and Cupcakes</h2>
          <p>
            I can cater your event with a custom cake or cupcakes that will make
            it memorable. I love making super tasty creations with interesting
            flavors, and I specialize in using fresh, seasonal fruit to make
            decorative and super tasty cakes and cupcakes.
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
            .
            <br />I can help you figure out the details about flavors or
            decorations, as well as the size of the cake or quantity of cupcakes
            and the price. For basic pricing info,{' '}
            <A href="/catering#pricing">see below</A>.<br /> <br />I have a menu
            of my previous flavors <A href="/menu">here</A>.
          </p>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.three}`}>
          <h2>Past Cakes</h2>
          <p>Here are some of the cakes I’ve made in the past:</p>
          <div class={styles.images}>
            <div class={styles.image}>
              <img src="/images/cake-1.png" alt="cake 1" />
              <p>2 layer chocolate raspberry cake</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cake-2.png" alt="cake 2" />
              <p>2 layer lemon raspberry cake</p>
            </div>
            <div class={styles.image}>
              <img src="/images/cake-3.png" alt="cake 3" />
              <p>12 layer sponge cake with fruit and other fillings</p>
            </div>
          </div>
        </div>
        <div class={`${styles.section} ${styles.four}`}>
          <h2>Cupcakes</h2>
          <p>Here are some of the cupcakes I've made for catering orders:</p>
          <div class={styles.images}>
            <div class={styles.image}>
              <img src="/images/cupcake-1.png" alt="cupcake 1" />
              <p>
                Frosting Mini Cupcakes
                <br />
                Front: Chocolate Vanilla
                <br />
                Back: Pumpkin Spice
              </p>
            </div>
            <div class={styles.image}>
              <img src="/images/cupcake-2.png" alt="cupcake 2" />
              <p>
                12 cupcake catering order
                <br />
                Left: Brown Sugar Sweet Potato
                <br />
                Right: Apple Pie
              </p>
            </div>
            <div class={styles.image}>
              <img src="/images/cupcake-3.png" alt="cupcake 3" />
              <p>Lemon Raspberry Cupcake</p>
            </div>
          </div>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.five}`} id="pricing">
          <h2>Pricing</h2>
          <p>
            In the end, pricing has to be done per-order, but I can give a
            general idea of how much basic cakes and cupcakes cost
            <br />
          </p>
          <br />
          <br />
          <h4>Cakes:</h4>
          <p>
            <br />
            6 in. 2 layer cake (serves 5-8): $40
            <br />
            6 in. 3 layer cake (serves 7-12): $60
            <br /> <br />
            9 in. 1 layer cake (serves 5-8): $40
            <br />
            9 in. 2 layer cake (serves 10-16): $75
            <br />
            9 in. 3 layer cake (serves 16-24): $100
            <br />
            <br />
            I can also make other sizes on request
            <br />
          </p>
          <br /> <br />
          <h4>Cupcakes (discounts for bulk orders):</h4>
          <p>
            12 regular cupcakes: $40 <br />
            24 mini cupcakes: $40 <br />
            <br />
            Detailed cupcake catering pricing information can be found{' '}
            <a
              href="/documents/cupcake-catering-pricing.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
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
