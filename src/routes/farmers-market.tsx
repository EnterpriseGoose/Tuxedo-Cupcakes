import { createSignal, For } from 'solid-js';
import Layout from '~/components/Layout';

import styles from './farmers-market.module.scss';

export default function Home() {
  const [dates, setDates] = createSignal([
    [new Date(2022, 7, 6), 'Chocolate Raspberry & Caramel Cashew'],
    [new Date(2022, 7, 13), 'Mint Chocolate Chip & Salted Caramel'],
    [new Date(2022, 7, 20), 'Cinnamon Peach & Chocolate Peanut Butter'],
    [new Date(2022, 7, 27), 'Chocolate Orange & Strawberry'],
    [new Date(2022, 8, 10), ''],
    [new Date(2022, 8, 17), ''],
    [new Date(2022, 9, 1), ''],
    [new Date(2022, 9, 8), ''],
    [new Date(2022, 9, 15), ''],
    [new Date(2022, 9, 29), ''],
  ]);
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Get a Cupcake at the Farmers’ Market</h2>
          <p>
            I appear at the Chatham Farmers’ Market on most Saturdays through
            October.
            <br />
            Each week, I bring 4 classic flavors (chocolate and vanilla), as
            well as 2 rotating special flavors, in both regular and mini sizes.
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Dates</h3>
          <p>
            Here are the full list of dates I’m appearing at the farmers’
            market, as well as the specials I will have available that day
            (2022):
          </p>
          <For each={dates()}>
            {([date, specials], i) => (
              <p>{`• ${date.toString().substring(4, 7)} ${(
                date as Date
              ).getDate()}${specials ? ` - ${specials}` : ''}`}</p>
            )}
          </For>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>Pricing</h3>
          <p>
            Classic Cupcakes <br />
            Regular - $3.50 <br />
            Mini - $2 <br />
            <br />
            Special Cupcakes <br />
            Regular - $4 <br />
            Mini - $2 <br />
            <br />
            Buy any 5 cupcakes of the same size and get one free!
          </p>
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
