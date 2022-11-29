import { createSignal, For, Match, Switch } from 'solid-js';
import { A } from 'solid-start';
import Layout from '~/components/Layout';
import styles from './index.module.scss';

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
          <h2>Get a Cupcake at the Farmers’ Market</h2>
          <p>
            I appear at the Chatham Farmers’ Market on most Saturdays through
            November.
            <br />
            Each week, I bring 4 classic flavors (chocolate and vanilla), as
            well as 2 rotating special flavors, in both regular and mini sizes.
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Dates</h3>
          <Switch
            fallback={
              <div>
                <p>
                  The 2022 farmers' market season has ended. Come back next year
                  for the 2023 Chatham Farmers' Market dates!
                </p>
                <A href="/farmers-market/past-flavors">
                  Click here to see past cupcake flavors
                </A>
              </div>
            }
          >
            <Match
              when={
                new Date().getMonth() > 4 &&
                (new Date().getMonth() < 10 ||
                  (new Date().getMonth() == 10 && new Date().getDate() < 20))
              }
            >
              <p class={styles.desc}>
                Here are the full list of dates I’m appearing at the farmers’
                market, as well as the specials I will have available that day
                (2022):
              </p>
              <ul>
                <For each={dates()}>
                  {([date, specials], i) => (
                    <li
                      class={(() => {
                        let thisDate = (date as Date).setHours(0, 0, 0, 0);
                        let lastDate = (
                          dates()[i() - 1] != undefined
                            ? (dates()[i() - 1][0] as Date)
                            : new Date(0)
                        ).getTime();
                        if (new Date().setHours(0, 0, 0, 0) === thisDate)
                          return styles.today;
                        else if (
                          new Date().setHours(0, 0, 0, 0) !== lastDate &&
                          new Date().getTime() > lastDate &&
                          new Date().getTime() < thisDate &&
                          i() == dates().length - 1
                        )
                          return styles.finalWeek;
                        else if (
                          new Date().setHours(0, 0, 0, 0) !== lastDate &&
                          new Date().getTime() > lastDate &&
                          new Date().getTime() < thisDate
                        )
                          return styles.nextWeek;
                        else return '';
                      })()}
                    >{`${date.toString().substring(4, 7)} ${(
                      date as Date
                    ).getDate()}${specials ? ` - ${specials}` : ''}`}</li>
                  )}
                </For>
              </ul>
            </Match>
          </Switch>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>Pricing</h3>
          <p>
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
