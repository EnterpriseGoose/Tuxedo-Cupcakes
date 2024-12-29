import { createSignal, For, Match, Switch } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './index.module.scss';
import { A } from '@solidjs/router';

export default function FarmersMarket() {
  const [dates, setDates] = createSignal([]);
  return (
    <Layout desc="I appear at the Chatham Farmers’ Market every Saturday in the summer (June-August) and about every other week in the fall (September-November). Each week, I bring 5 classic flavors (chocolate, vanilla, and strawberry), as well as 2 rotating special flavors, in both regular and mini sizes.">
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Get a Cupcake at the Farmers’ Market</h2>
          <p>
            I am at at the Chatham Farmers’ Market every Saturday. Each week, I
            bring 4 classic flavors (chocolate, vanilla, and strawberry), as
            well as 2 rotating special flavors, in both regular and mini sizes.
          </p>
        </div>
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Dates</h3>
          <Switch
            fallback={
              <div>
                <p>
                  The 2024 farmers' market season has ended. Come back next year
                  for the 2025 Chatham Farmers' Market dates!
                </p>
              </div>
            }
          >
            <Match
              when={
                new Date().getMonth() > 2 &&
                (new Date().getMonth() < 10 ||
                  (new Date().getMonth() == 10 && new Date().getDate() < 17))
              }
            >
              <p class={styles.desc}>
                Here is the full list of dates I'm appearing at the farmers’
                markets, as well as the specials I'll have available that day.
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
                        let today = new Date().setHours(0, 0, 0, 0);
                        let lastDate = (
                          i() !== 0
                            ? (dates()[i() - 1][0] as Date)
                            : new Date(0)
                        ).getTime();
                        if (
                          today ===
                          thisDate /*|| today === thisDate + 86400000*/
                        )
                          return styles.today;
                        else if (
                          today !== lastDate &&
                          today !== lastDate + 86400000 &&
                          new Date().getTime() > lastDate &&
                          new Date().getTime() < thisDate
                        ) {
                          if (i() == 0) return styles.firstWeek;
                          else if (i() == dates().length - 1)
                            return styles.finalWeek;
                          else return styles.nextWeek;
                        } else return '';
                      })()}
                    >
                      {`${date.toString().substring(4, 7)} ${(
                        date as Date
                      ).getDate()}` +
                        // -${
                        //   (date as Date).getDate() + 1 < 32
                        //     ? (date as Date).getDate() + 1
                        //     : 1
                        // }
                        `${specials ? ` - ${specials}` : ''}`}
                    </li>
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
          <h3>Contact us</h3>
          <h4>
            Contact us at
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
      </div>
    </Layout>
  );
}
