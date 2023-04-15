import { A } from '@solidjs/router';
import Layout from '~/components/Layout';
import styles from './faqs.module.scss';

export default function VirtualMarket() {
  return (
    <Layout>
      <div class={styles.sections}>
        <div class={`${styles.section} ${styles.one}`}>
          <h2>Virtual Market FAQs</h2>
          <br />
          <h4>What are 'virtual markets' and how do virtual markets work?</h4>
          <p>
            Virtual markets are an opportunity to buy cupcakes in smaller
            quantities, similarly to if you were to go to the Farmers' Market.
            <br />
            To participate in a virtual market, you have to place an order{' '}
            <A href="/virtual-market/order">here</A> before the deadline. The
            deadline will always be a few days before the delivery date. On the
            delivery date, your cupcakes will be delivered to your house at some
            point in the early afternoon (you can sign up to get a text estimate
            of the time). You are required to be at your house when the cupcakes
            are delivered, as you pay when they are delivered.
          </p>
          <br />
          <h4>
            What if I can't be at my house on the delivery date or at the
            delivery time?
          </h4>
          <p>
            Email me at{' '}
            <a
              href="mailto:oliver@tuxedocupcakes.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              oliver@tuxedocupcakes.com
            </a>{' '}
            and we might be able to figure something out.
          </p>
          <br />
          <h4>
            I go to CHS (staff or student) and would like to order cupcakes. Can
            you deliver them at CHS?
          </h4>
          <p>
            I am a student at CHS, so I am able to make deliveries at CHS on the
            school day following the virtual market date. Just make sure to
            specify that you would like this when ordering (in the special
            delivery notes section). I will contact you to figure out a school
            day following the market date that will work for dropoff.
          </p>
          <br />
          <h4>What is the difference between virtual markets and catering?</h4>
          <p>
            Virtual markets have a much smaller minimum order size (2 regular /
            6 mini), compared to the 12 regular or 24 mini minimum order size
            for catering. <br />
            Virtual markets have a set date, while catering can be delivered
            whenever you want.
          </p>
          <br />
          <h4>When is the next virutal market?</h4>
          <p>
            The idea with virtual markets is that it allows me to have a way of
            selling cupcakes similar to the Farmers' Markets when it's not
            Farmers' Market season. This means that I will only schedule virtual
            markets for the winter and spring when I don't already have a
            Farmers' Market. <br />I will schedule virtual markets about a month
            (or more) ahead in the winter and spring. If you look at the bottom
            of the <A href="/virtual-market/">virtual markets</A> page, it has
            all of the currently scheduled dates.
          </p>
        </div>
        <img src="/images/decorations/bow-divider.svg" class={styles.divider} />
        <div class={`${styles.section} ${styles.four}`}>
          <h3>Still have questions?</h3>
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
