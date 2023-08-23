import { createSignal, For, Match, Switch } from 'solid-js';
import { A } from 'solid-start';
import Layout from '~/components/Layout';
import styles from './index.module.scss';

export default function FarmersMarket() {
  const [dates, setDates] = createSignal([
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
      'Chocolate Raspberry & Mint Chocolate Chip *& Lilikoi Guava*',
    ],
    [new Date(2023, 7, 12), 'Pomegranate & Lemon Raspberry'],
    [new Date(2023, 7, 19), 'Cinnamon Peach & Yuzu'],
    [new Date(2023, 7, 26), 'Mint Chocolate Chip & Yuzu'],
    [new Date(2023, 8, 2), '???'],
    [new Date(2023, 8, 9), '???'],
    [new Date(2023, 8, 23), '???'],
    [new Date(2023, 9, 7), '???'],
    [new Date(2023, 9, 28), '???'],
    [new Date(2023, 10, 11), '???'],
    [new Date(2023, 10, 18), '???'],
  ]);
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Get a Cupcake at the Farmers’ Market</h2>
          <p>
            I appear at the Chatham Farmers’ Market every Saturday in the summer
            (June-August) and about every other week in the fall
            (September-November).
            <br /> <br />
            Each week, I bring 5 classic flavors (chocolate, vanilla, and
            strawberry), as well as 2 rotating special flavors, in both regular
            and mini sizes.
            <br /> <br />
            This year I will also be hosting the{' '}
            <A href="/sweet-16/">Sweet 16 Cupcake Bracket</A>
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Dates</h3>
          <Switch
            fallback={
              <div>
                <p>
                  The 2023 farmers' market season has ended. Come back next year
                  for the 2024 Chatham Farmers' Market dates!
                </p>
                <A href="/farmers-market/past-flavors">
                  Click here to see past cupcake flavors
                </A>
              </div>
            }
          >
            <Match
              when={
                new Date().getMonth() > 2 &&
                (new Date().getMonth() < 10 ||
                  (new Date().getMonth() == 10 && new Date().getDate() < 20))
              }
            >
              <p class={styles.desc}>
                Here is the full list of dates I’m appearing at the farmers’
                market, as well as the specials I will have available that day.
                If you want to know the specials ahead of time, you can sign up
                for <A href="/newsletter">the newsletter</A> or follow{' '}
                <a
                  href="https://www.instagram.com/tuxedo_cupcakes/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  my instagram
                </a>
                .
              </p>
              <ul>
                <For each={dates()}>
                  {([date, specials], i) => (
                    <li
                      class={(() => {
                        let thisDate = (date as Date).setHours(0, 0, 0, 0);
                        let lastDate = (
                          i() !== 0
                            ? (dates()[i() - 1][0] as Date)
                            : new Date(0)
                        ).getTime();
                        if (new Date().setHours(0, 0, 0, 0) === thisDate)
                          return styles.today;
                        else if (
                          new Date().setHours(0, 0, 0, 0) !== lastDate &&
                          new Date().getTime() > lastDate &&
                          new Date().getTime() < thisDate
                        ) {
                          if (i() == 0) return styles.firstWeek;
                          else if (i() == dates().length - 1)
                            return styles.finalWeek;
                          else return styles.nextWeek;
                        } else return '';
                      })()}
                    >{`${date.toString().substring(4, 7)} ${(
                      date as Date
                    ).getDate()}${specials ? ` - ${specials}` : ''}`}</li>
                  )}
                </For>
              </ul>
            </Match>
          </Switch>
          <A href="/farmers-market/past-flavors">
            Click here to see past cupcake flavors
          </A>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>Pricing</h3>
          <p>
            Regular - $4 <br />
            Mini - $2 <br />
            <br />
            Buy any 5 cupcakes of the same size and get one free!
          </p>
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
