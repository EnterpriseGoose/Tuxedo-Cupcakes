import { createSignal, For, Match, Switch } from 'solid-js';
import { A } from 'solid-start';
import Layout from '~/components/Layout';
import styles from './past-flavors.module.scss';

export default function FarmersMarket() {
  const [dates, setDates] = createSignal([
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
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Past Flavors</h2>
          <p>Here I list any flavors from past Farmers' Markets</p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>2022</h3>
          <ul>
            <For each={dates()}>
              {([date, specials], i) => (
                <li>{`${date.toString().substring(4, 7)} ${(
                  date as Date
                ).getDate()}${specials ? ` - ${specials}` : ''}`}</li>
              )}
            </For>
          </ul>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.four}`}>
          <h3>Contact me</h3>
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
