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

  const [dates2024, setDates2024] = createSignal([
    [new Date(2024, 5, 15), 'Lemon Raspberry & Chocolate Peanut Butter'],
    [new Date(2024, 5, 22), 'Coconut Passion Fruit & Mocha'],
    [new Date(2024, 5, 29), 'Salted Caramel Cashew & Chocolate Raspberry'],
    [new Date(2024, 6, 6), 'Salted Caramel Cashew & Chocolate Cherry'],
    [new Date(2024, 6, 13), 'Lemon Pistachio & Coconut Raspberry'],
    [new Date(2024, 6, 20), 'Mango & Coconut Raspberry'],
    [new Date(2024, 6, 27), 'Cinnamon Peach & Masala Chai'],
    [new Date(2024, 7, 3), 'Coconut Mango & Lemon Blueberry'],
    [new Date(2024, 7, 17), 'Salted Caramel Cashew & Chocolate Lemon'],
    [new Date(2024, 7, 24), 'Coconut Pineapple & Chocolate Mango'],
    [new Date(2024, 7, 31), 'Salted Caramel Cashew & Chocolate Peanut Butter'],
    [new Date(2024, 8, 7), 'Cinnamon Peach & Chocolate Raspberry'],
    [new Date(2024, 8, 14), 'Chocolate Black Sesame & Red Bean'],
    [new Date(2024, 8, 21), 'Cinnamon Peach & Pumpkin Spice'],
    [new Date(2024, 9, 5), 'Salted Caramel Cashew & Pumpkin Spice'],
    [new Date(2024, 9, 12), 'Cinnamon Apple Cider & Chocolate Matcha'],
    [new Date(2024, 9, 19), 'Masala Chai & Chocolate Caramel'],
    [new Date(2024, 9, 26), 'Chocolate Black Sesame & Chocolate Matcha'],
    [new Date(2024, 10, 2), 'Pumpkin Spice & Apple Pie'],
    [new Date(2024, 10, 9), 'Chocolate Peppermint & Mocha'],
    [new Date(2024, 10, 16), 'Mexican Hot Chocolate & Gingerbread'],
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
          <h3>2024</h3>
          <ul>
            <For each={dates2024()}>
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
