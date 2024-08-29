import Layout from '~/components/Layout';
import styles from './flavors.module.scss';

export default function Flavors() {
  return (
    <Layout desc="View the menu of cupcake flavors I can make">
      <div class={styles.menu}>
        <h2>Flavors</h2>
        <p class={styles.desc}>
          These are some of the flavors we have done in the past. If you have an
          idea for a flavor not on this list, reach out and we'll see what we
          can do!
        </p>
        <h3>Classics</h3>
        <p>
          Vanilla&nbsp;Vanilla <br />
          Vanilla&nbsp;Chocolate <br />
          Chocolate&nbsp;Vanilla <br />
          Chocolate&nbsp;Chocolate <br />
          Strawberry <br />
        </p>
        <h3>Favorites</h3>
        <p>
          Lemon&nbsp;Raspberry <br />
          Lemon&nbsp;Blueberry <br />
          Chocolate&nbsp;Strawberry <br />
          Salted&nbsp;Caramel&nbsp;Cashew <br />
          Mint&nbsp;Chocolate&nbsp;Chip <br />
          Chocolate&nbsp;Caramel <br />
          Chocolate&nbsp;Matcha <br />
          Chocolate&nbsp;Raspberry <br />
          Chocolate&nbsp;Peppermint <br />
          Pumpkin&nbsp;Spice <br />
          Cinnamon&nbsp;Apple&nbsp;Cider <br />
          Apple&nbsp;Pie <br />
          Gingerbread <br />
          Panettone <br />
          Red&nbsp;Bean <br />
          Chocolate&nbsp;Black&nbsp;Sesame <br />
          Yuzu <br />
          Pomegranate <br />
          Chocolate&nbsp;Peanut&nbsp;Butter <br />
          Chocolate&nbsp;Orange <br />
        </p>
        <h3>Large&nbsp;Order&nbsp;Only</h3>
        <p>
          Coconut&nbsp;Passion&nbsp;Fruit <br />
          Coconut&nbsp;Pineapple <br />
          Lilikoi&nbsp;Guava <br />
          Pineapple&nbsp;Cake <br />
          Brown&nbsp;Sugar&nbsp;Sweet&nbsp;Potato <br />
        </p>
        <h3>Seasonal</h3>
        <p>
          Mango <br />
          Cinnamon&nbsp;Peach <br />
          Lemon&nbsp;Peach&nbsp;Blueberry
        </p>
      </div>
      <div class={styles.contact}>
        <h2>Contact</h2>
        <h4>
          To place an order (or if you have any other questions), contact us at
          <br />
          <a
            href="mailto:hello@tuxedocupcakes.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            hello@tuxedocupcakes.com
          </a>
        </h4>
      </div>
    </Layout>
  );
}
