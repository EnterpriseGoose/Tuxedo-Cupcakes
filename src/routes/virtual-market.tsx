import sgMail from '@sendgrid/mail';
import { APIEvent } from 'solid-start/api';
import { redirect } from 'solid-start/server';
import { createSignal, For } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './virtual-market.module.scss';

export default function Home() {
  const [dates, setDates] = createSignal([[new Date(2022, 11), '???']]);
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
            onsubmit={() => {
              return false;
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
            Delivery is free within Chatham and neighboring towns. There may be
            an additional fee for delieveres far from Chatham. Contact me at{' '}
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

export async function POST({ request }: APIEvent) {
  let formData = await request.formData();
  let email = formData.get('email');
  console.log(email);
  sgMail.setApiKey(import.meta.env.VITE_SENDGRID_API_KEY);
  console.log(import.meta.env.VITE_SENDGRID_API_KEY);
  const msg = {
    to: 'oliver@tuxedocupcakes.com', // Change to your recipient
    from: 'oliver@tuxedocupcakes.com', // Change to your verified sender
    subject: 'New subscriber to Tuxedo Cupcakes',
    html: 'New email to tuxedo cupcakes list: ' + email,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log('Email sent');
    })
    .catch((error) => {
      console.error(error);
    });
  return redirect('?sign-up=success');
}
