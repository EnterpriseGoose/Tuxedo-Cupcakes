import { APIEvent } from 'solid-start/api';
import server$, { redirect } from 'solid-start/server';
import { createSignal, For, Match, Switch } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './virtual-market.module.scss';
import { createClient } from '@supabase/supabase-js';
import { useLocation, useParams, useSearchParams } from 'solid-start';

export default function Home() {
  const [searchParams, setSearchparams] = useSearchParams();
  const [dates, setDates] = createSignal([]);
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Order Cupcakes from the Tuxedo Cupcakes Virtual Market</h2>
          <p>
            When it's not market season, I will do occasional virtual markets.
            <br />
            These markets are an opportunity to get cupcakes in smaller
            quantites, similar to going to the farmers' market. Each virtual
            market will have both the classics (Chocolate & Vanilla) as well as
            a couple different special flavors
            <br /> <br />
            To participate in a virtual market, you have to place an order a few
            days before the market day. On the market day, your order will be
            delivered at some point in the afternoon.
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Next Virtual Market</h3>
          <p>
            The next virtual market will be a Holiday Virtual Market in December
          </p>
          <br />
          <p>
            The date is currently TBD. Sign up to get updates about when the
            market will be and how you can order cupcakes:
          </p>
          <form
            action=""
            method="post"
            class="form-example"
            onsubmit={async (event) => {
              event.preventDefault();
              let email = event.target.children[0].value;
              const supabase = createClient(
                'https://rxznihvftodgtjdtzbyr.supabase.co',
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
              );
              let response = await supabase.from('emailList').insert({ email });
              console.log(response.status);
              setSearchparams({ status: response.status });
              event.target.children[0].value = '';
            }}
          >
            <input
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              required
            />{' '}
            <input type="submit" id="button" value="Sign Up" />
          </form>
          <Switch>
            <Match when={searchParams.status === '201'}>Email added to list!</Match>
            <Match when={searchParams.status === '409'}>
              Email is already on list.
            </Match>
            <Match
              when={
                searchParams.status !== '201' &&
                searchParams.status !== '409' &&
                searchParams.status !== undefined
              }
            >
              An unknown error occured. Try again.
            </Match>
          </Switch>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>Pricing</h3>
          <p>
            Cupcakes are priced by the size of box. A box can contain any mix of
            cupcakes.
          </p>
          <h4>Regular Size Cupcakes:</h4>
          <p>Box of 2 - $8</p>
          <p>Box of 4 - $15</p>
          <p>Box of 6 - $20</p>
          <p>Box of 12 - $40</p>
          <br />
          <h4>Mini Cupcakes:</h4>
          <p>Box of 6 - $10</p>
          <p>Box of 12 - $20</p>
          <br />
          <p>
            Delivery is free within Chatham and some neighboring towns. There
            may be an additional fee for delieveres more than a few miles out
            from Chatham. Contact me at{' '}
            <a
              href="mailto:oliver@tuxedocupcakes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              oliver@tuxedocupcakes.com
            </a>{' '}
            with any questions
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />

        <div class={`${styles.section} ${styles.four}`}>
          <h3>Dates</h3>
          <p class={styles.desc}>
            Here are the dates that I'm currently planning a virtual market for.
            Keep in mind, these dates are subject to change, as I will keep
            adding dates as they get closer.
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
