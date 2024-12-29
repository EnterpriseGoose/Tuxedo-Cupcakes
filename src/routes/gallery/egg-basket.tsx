import Layout from '~/components/Layout';
import styles from './egg-basket.module.scss';
import { A } from '@solidjs/router';

export default function Newsletter() {
  return (
    <Layout minimal>
      <div class={styles.gallery}>
        <A href="/order">
          <div class={styles.backButton}>↰ Back</div>
        </A>
        <h1>Egg Basket Cupcake</h1>
        <div class={styles.twoColumn}>
          <img src="/images/gallery/egg-nest.png" width={400} />
          <p>
            An Easter special, the Egg Basket Cupcake is a super delicious and
            pretty cupcake that features a chocolate frosting 'nest' with
            chocolate eggs all on top of a light vanilla cake base. These are
            the perfect way to celebrate easter with some super tasty cupcakes!
          </p>
        </div>
        <p>
          Please note that Egg Basket Cupcakes are +$1 for regulars and +$.5 for
          minis. The website cost calculator will not automatically account for
          this, but your final invoice (emailed to you) will include this price
          adjustment.
        </p>
      </div>
    </Layout>
  );
}
