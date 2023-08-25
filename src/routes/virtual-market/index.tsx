import { createSignal, For } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './index.module.scss';
import { A } from 'solid-start';
import EmailForm from '~/components/EmailForm';

export default function VirtualMarket() {
  const [dates, setDates] = createSignal([]);
  return (
    <Layout desc="Virtual Markets are an opportunity to get cupcakes in smaller quantities, similar to going to the farmers' market. Each virtual market will have both the classics (Chocolate & Vanilla) as well as a couple different special flavors.">
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Order Cupcakes from the Tuxedo Cupcakes Virtual Market</h2>
          <p>
            When it's not market season, I will do occasional virtual markets.
            <br />
            These markets are an opportunity to get cupcakes in smaller
            quantities, similar to going to the farmers' market. Each virtual
            market will have both the classics (Chocolate & Vanilla) as well as
            a couple different special flavors.
            <br /> <br />
            To participate in a virtual market, you have to place an order a few
            days before the market day. On the market day, your order will be
            delivered at some point in the afternoon.
            <br /> <br />
            <A href="/virtual-market/faqs">Virtual Market FAQs</A>
          </p>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.two}`}>
          <h3>Next Virtual Market</h3>
          <p>
            There will not be another virtual market until after this year's{' '}
            <A href="/farmers-market">Farmers' Market season</A>.
          </p>
          <br />
          {/* <h4>The flavors are:</h4>
          <p>
            Vanilla-Vanilla
            <br />
            Vanilla-Chocolate
            <br />
            Chocolate-Vanilla
            <br />
            Chocolate-Chocolate
            <br />
            (Cake-Frosting)
            <br />
            <br />
            Gingerbread - Gingerbread cake with a light cream cheese frosting
            <br />
            Panettone - Panettone cake with a mascarpone frosting
            <br />
          </p>
          <br />
          <h3>
            <A href="/virtual-market/order">Click here to place an order</A>
          </h3> */}
          <p>
            <br /> <br />
            Sign up to be updated about future virtual markets as well as other
            news about Tuxedo Cupcakes:
            <EmailForm />
          </p>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />
        <div class={`${styles.section} ${styles.three}`}>
          <h3>Pricing</h3>
          <p>
            Cupcakes are priced by the box. A box can contain any mix of
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
            may be an additional fee for deliveries more than a few miles out
            from Chatham. Contact me at{' '}
            <a
              href="mailto:oliver@tuxedocupcakes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              oliver@tuxedocupcakes.com
            </a>{' '}
            with any questions.
          </p>
        </div>
        <img
          src="/images/decorations/bow-divider.svg"
          class={styles.divider}
          alt=""
        />

        <div class={`${styles.section} ${styles.four}`}>
          <h3>Dates</h3>
          <p class={styles.desc}>
            There are currently no virtual markets planned. <br />
            Look back here closer to the end of this year's market season to see
            the virtual market dates. <br />
            If you want to be notified when a new date is added, sign up for the
            Tuxedo Cupcakes newsletter!
          </p>
          <EmailForm />
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
