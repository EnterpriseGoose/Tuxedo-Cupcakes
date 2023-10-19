import Layout from '~/components/Layout';
import styles from './menu.module.scss';

export default function Menu() {
  return (
    <Layout desc="View the menu of cupcake flavors I can make">
      <div class={styles.menu}>
        <h2>Menu</h2>
        <p>
          These are some of the flavors I have done in the past. If you have an
          idea for a flavor not on this list, reach out and I'll see what I can
          do!
        </p>
        <h3>Classics</h3>
        <p>
          Vanilla Vanilla <br />
          Vanilla Chocolate <br />
          Chocolate Vanilla <br />
          Chocolate Chocolate <br />
          Strawberry <br />
        </p>
        <h3>Favorites</h3>
        <p>
          Lemon Raspberry <br />
          Lemon Blueberry <br />
          Chocolate Strawberry <br />
          Salted Caramel Cashew <br />
          Mint Chocolate Chip <br />
          Chocolate Caramel <br />
          Chocolate Matcha <br />
          Chocolate Raspberry <br />
          Pumpkin Spice <br />
          Cinnamon Apple Cider <br />
          Apple Pie <br />
          Red Bean <br />
          Chocolate Black Sesame <br />
          Yuzu <br />
          Pomegranate <br />
          Chocolate Peanut Butter <br />
          Chocolate Orange <br />
        </p>
        <h3>Large Order Only</h3>
        <p>
          Coconut Passion Fruit <br />
          Coconut Pineapple <br />
          Lilikoi Guava <br />
          Pineapple Cake <br />
          Brown Sugar Sweet Potato <br />
        </p>
        <h3>Seasonal</h3>
        <p>
          Mango <br />
          Cinnamon Peach <br />
          Lemon Peach Blueberry
        </p>
      </div>
      <div class={styles.contact}>
        <h2>Contact</h2>
        <h4>
          To place an order (or if you have any other questions), contact me at
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
    </Layout>
  );
}
