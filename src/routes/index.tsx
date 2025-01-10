import Layout from '~/components/Layout';
import Card from '~/components/Card';

import styles from './index.module.scss';
import EmailForm from '~/components/EmailForm';

export default function Home() {
  return (
    <Layout>
      <div class={styles.sections}>
        {/* <div class={`${styles.section} ${styles.zero}`}>
          <h1>New Year's Eve Pop&#8209;up</h1>
          <div class={`${styles.card} ${styles.eggnog}`}>
            <img src="/images/cupcake-graphics/eggnog.svg" />
            <div>
              <h2>Eggnog</h2>
              <i>custard + nutmeg</i>
            </div>
          </div>
          <div class={`${styles.card} ${styles.panettone}`}>
            <img src="/images/cupcake-graphics/panettone.svg" />
            <div>
              <h2>Panettone</h2>
              <i>fruitcake + creme</i>
            </div>
          </div>
          <div class={`${styles.card} ${styles.gingerbread}`}>
            <img src="/images/cupcake-graphics/gingerbread.svg" />
            <div>
              <h2>Gingerbread</h2>
              <i>ginger + spices</i>
            </div>
          </div>
          <div class={`${styles.card} ${styles.classics}`}>
            <img src="/images/cupcake-graphics/classics-trio.svg" />
            <div>
              <h2>Classics</h2>
              <i>vanilla, chocolate +&nbsp;strawberry</i>
            </div>
          </div>
          <button
            class={`${styles.order} button`}
            onclick={() => {
              window.location.pathname = '/order';
            }}
          >
            Order Now!
          </button>
        </div> */}
        <div class={`${styles.section} ${styles.one}`}>
          <h2>A More Sophisticated Cupcake</h2>
          <p>
            Tuxedo Cupcakes aims to make a cupcake that kids and adults alike
            can enjoy. <br /> With the perfect balance of sweetness and bold
            flavors, Tuxedo Cupcakes uses the best ingredients to make the best
            cupcakes.
          </p>
          <div class={styles.gallery}>
            <img
              src="/images/gallery/top-left-cupcakes.png"
              id={styles.topLeft}
            />
            <img
              src="/images/gallery/top-right-cupcakes.png"
              id={styles.topRight}
            />
            <img
              src="/images/gallery/bottom-left-cupcakes.png"
              id={styles.bottomLeft}
            />
            <img
              src="/images/gallery/bottom-middle-cupcakes.png"
              id={styles.bottomMiddle}
            />
            <img
              src="/images/gallery/bottom-right-cupcakes.png"
              id={styles.bottomRight}
            />
          </div>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.two}`}>
          <h2>How to get Tuxedo Cupcakes</h2>
          <div class={styles.cards}>
            <Card title="Catering" link="/catering?p=m">
              I can provide your event with a cake or cupcakes that will make it
              memorable
            </Card>
            <Card title="Pop-ups" link="/order?p=m">
              When it's not Farmers' Market season, I will do occasional pop-ups
              that are a chance to order a smaller quantity of cupcakes. Place
              an order today!
            </Card>
            <Card title="Farmers' Market" link="/farmers-market?p=m">
              I attend the Chatham and Morristown Farmers’ Markets, where you
              can choose from a selection of cupcakes I have available that day
            </Card>
          </div>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.three}`}>
          <h2>Newsletter</h2>
          <p>
            Sign up for the Tuxedo Cupcakes newsletter to get notified of
            events, weekly flavors, virtual markets and more!
          </p>
          <div class={styles.emailForm}>
            <EmailForm />
          </div>

          <h2>Contact</h2>
          <h4>
            Contact me at
            <br />
            <a
              href="mailto:olive@tuxedocupcakes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              olive@tuxedocupcakes.com
            </a>
          </h4>
        </div>
      </div>
    </Layout>
  );
}
