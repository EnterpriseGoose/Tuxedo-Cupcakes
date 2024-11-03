import { createSignal, For, Match, Switch } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './past-flavors.module.scss';

export default function FarmersMarket() {
  const [dates2022, setDates2022] = createSignal([
    [new Date(2022, 7, 6), 'Chocolate Raspberry & Caramel Cashew'],
    [new Date(2022, 7, 13), 'Mint Chocolate Chip & Salted Caramel'],
    [new Date(2022, 7, 20), 'Cinnamon Peach & Chocolate Peanut Butter'],
    [new Date(2022, 7, 27), 'Chocolate Raspberry & Strawberry'],
    [
      new Date(2022, 8, 10),
      'Red Bean, Chocolate Black Sesame & Pineapple Cake',
    ],
    [new Date(2022, 8, 17), 'Chocolate Orange & Strawberry'],
    [new Date(2022, 9, 1), 'Chocolate Matcha & Yuzu'],
    [new Date(2022, 9, 8), 'Pumpkin Spice & Caramel Apple'],
    [new Date(2022, 9, 15), 'Cinnamon Apple Cider & Smores'],
    [new Date(2022, 9, 29), 'Chocolate Black Sesame & Pumpkin Spice'],
    [new Date(2022, 10, 12), 'Mint Chocolate Chip & Chocolate Peanut Butter'],
    [new Date(2022, 10, 19), 'Brown Sugar Sweet Potato & Apple Pie'],
  ]);

  const [dates2023, setDates2023] = createSignal([
    [
      new Date(2023, 5, 17),
      'Coconut Passion Fruit, Salted Caramel Cashew, & Chocolate Strawberry',
    ],
    [new Date(2023, 5, 24), 'Lemon Blueberry & Mint Chocolate Chip'],
    [new Date(2023, 6, 1), 'Pomegranate & Chocolate Hazelnut'],
    [new Date(2023, 6, 8), 'Lemon Raspberry & Chocolate Caramel'],
    [new Date(2023, 6, 15), 'Coconut Passion Fruit & Chocolate Matcha'],
    [new Date(2023, 6, 22), 'Mango & Salted Caramel Cashew'],
    [
      new Date(2023, 7, 5),
      'Chocolate Raspberry & Mint Chocolate Chip & Lilikoi Guava',
    ],
    [new Date(2023, 7, 12), 'Pomegranate & Lemon Raspberry'],
    [new Date(2023, 7, 19), 'Cinnamon Peach & Yuzu'],
    [new Date(2023, 7, 26), 'Mint Chocolate Chip & Yuzu'],
    [new Date(2023, 8, 2), 'Chocolate Matcha & Salted Caramel Cashew'],
    [new Date(2023, 8, 9), 'Lemon Raspberry & Salted Caramel Cashew'],
    [new Date(2023, 8, 16), 'Cinnamon Apple Cider & Pumpkin Spice'],
    [new Date(2023, 8, 30), 'Chocolate Black Sesame & Red Bean'],
    [new Date(2023, 9, 14), 'Pumpkin Spice & Red Bean'],
    [new Date(2023, 10, 4), 'Red Bean & Mint Chocolate Chip'],
    [new Date(2023, 10, 11), 'Lemon Raspberry & Salted Caramel Cashew'],
    [new Date(2023, 10, 18), 'Red Bean & Lemon Raspberry'],
  ]);
  return (
    <Layout desc="View my past specials for previous Chatham Farmers' Market seasons">
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Past Specials</h2>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>2022</h3>
          <ul>
            <For each={dates2022()}>
              {([date, specials], i) => (
                <li>{`${date.toString().substring(4, 7)} ${(
                  date as Date
                ).getDate()}${specials ? ` - ${specials}` : ''}`}</li>
              )}
            </For>
          </ul>
          <h3>2023</h3>
          <ul>
            <For each={dates2023()}>
              {([date, specials], i) => (
                <li>{`${date.toString().substring(4, 7)} ${(
                  date as Date
                ).getDate()}${specials ? ` - ${specials}` : ''}`}</li>
              )}
            </For>
          </ul>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.four}`}>
          <h3>Contact me</h3>
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
