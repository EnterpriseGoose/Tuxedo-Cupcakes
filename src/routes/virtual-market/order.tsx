import { createEffect, createSignal, For, Match, Show, Switch } from 'solid-js';
import Layout from '~/components/Layout';
import styles from './order.module.scss';
import { createClient } from '@supabase/supabase-js';
import { useSearchParams, A } from 'solid-start';
import EmailForm from '~/components/EmailForm';

const UPCOMING_VIRTUAL_MARKET = false;

const products = [
  { name: 'Box of 2 regular cupcakes', cost: 8, custom: 'flavor' },
  { name: 'Box of 4 regular cupcakes', cost: 15, custom: 'flavor' },
  { name: 'Box of 6 regular cupcakes', cost: 20, custom: 'flavor' },
  { name: 'Box of 12 regular cupcakes', cost: 40, custom: 'flavor' },
  { name: 'Box of 6 mini cupcakes', cost: 10, custom: 'flavor' },
  { name: 'Box of 12 mini cupcakes', cost: 20, custom: 'flavor' },
  { name: 'Box of 6 penguin chocolates', cost: 15, custom: 'flavor' },
  { name: 'Box of 12 penguin chocolates', cost: 25, custom: 'flavor' },
  { name: 'Caramel Cashews - 4oz', cost: 5, custom: 'none' },
];

export default function VirtualMarket() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [cart, setCart] = createSignal([], { equals: false });
  let placeOrderButton: HTMLInputElement;

  createEffect(() => {
    if (UPCOMING_VIRTUAL_MARKET) {
      if (cart().length === 0) {
        placeOrderButton.children[0].disabled = true;
      } else {
        placeOrderButton.children[0].disabled = false;
      }
    }
  });

  return (
    <Layout>
      <div class={styles.sections}>
        <Show
          when={UPCOMING_VIRTUAL_MARKET}
          fallback={
            <div class={`${styles.section} ${styles.fallbackOne}`}>
              <h2>There is currently no upcoming virtual market</h2>
              <p>
                Check back here when there is to be able to place an order.{' '}
                <br />
                Want to be notified when there is a new virtual market? Sign up
                to the Tuxedo Cupcakes newsletter: <br />
                <EmailForm />
              </p>
            </div>
          }
        >
          <div class={`${styles.section} ${styles.one}`}>
            <h2>Place an Order for the Holiday Virtual Market</h2>
            <p>
              Place an order for the December 18th Holiday Virtual Market using
              the form below. The deadline for placing orders is Thursday,
              December 15th.
            </p>
            <A href="/virtual-market/faqs">Virtual Market FAQs</A>
            <br />
            <br />
            <h4>Process of ordering cupcakes</h4>
            <ol>
              <li>
                Place an order by Thursday, December 15th using the form below.
                You will receive a confirmation email within a day confirming
                your order.
              </li>
              <li>
                On Sunday, December 18th (the day of delivery), a more exact
                delivery time will be texted to you if you selected to get
                delivery notification texts.
              </li>
              <li>
                Shortly before your order is delivered, you will receive another
                text.
              </li>
              <li>
                When you receive your cupcakes, you can pay using cash, credit,
                venmo, etc. (there is a small fee if using anything except
                cash).
              </li>
              <li>Enjoy your cupcakes!</li>
            </ol>
            <br />
            (If you select to have your cupcakes delivered to you at CHS, the
            process will be slightly different. See{' '}
            <A href="/virtual-market/faqs">the FAQs</A> for more information)
            <br /> <br /> <br />
            <h4>Cupcake Flavors</h4>
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
            <br /> <br />
            <h4>Penguin Chocolates Flavors</h4>
            <p>
              Raspberry <br />
              Hazelnut <br />
              Caramel <br />
            </p>
            <br /> <br />
            <h4>Pricing</h4>
            <p>
              Cupcakes and chocolates are sold by the box. A box can contain any
              mix of flavors.
              <br />
              Candied cashews are sold in 4oz bags
            </p>
            <p>
              Delivery is free within Chatham and some neighboring towns. I am
              also a student at CHS, so I can deliver them to you at CHS on a
              school day following the market date. There may be an additional
              fee for deliveries more than a few miles out from Chatham. Contact
              me at{' '}
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
          />
          <div class={`${styles.section} ${styles.two}`}>
            <h3>Products</h3>
            <p>
              Click on a product to add it to your cart. Flavors are chosen in
              the cart (cart is below)
            </p>{' '}
            <br />
            <div id={styles.productGrid}>
              <For each={products}>
                {(product, i) => (
                  <div
                    onClick={() => {
                      setCart([...cart(), product]);
                    }}
                  >
                    <p class={styles.productName}>{product.name}</p>
                    <br />
                    <p class={styles.productCost}>${product.cost}</p>
                  </div>
                )}
              </For>
            </div>
          </div>
          <img
            src="/images/decorations/bow-divider.svg"
            class={styles.divider}
          />
          <div class={`${styles.section} ${styles.three}`}>
            <h3>Cart</h3>
            <br />
            <form
              action=""
              method="post"
              onsubmit={(event) => {
                placeOrder(event, setSearchParams, setCart);
              }}
            >
              <div id={styles.order}>
                <For
                  each={cart()}
                  fallback={<p>Your cart is currently empty</p>}
                >
                  {(item, i) => (
                    <div class="cart-item">
                      <p class={styles.name}>{item.name}</p>
                      <Show when={item.custom === 'flavor'}>
                        <textarea
                          name="flavors"
                          placeholder="*Flavor(s)&#10;(see above for flavors)"
                          required
                          spellcheck
                        ></textarea>
                      </Show>
                      <p class={styles.cost}>${item.cost}</p>
                      <button
                        onClick={() => {
                          let cartItems = cart();
                          cartItems.splice(i(), 1);
                          setCart(cartItems);
                        }}
                      >
                        x
                      </button>
                    </div>
                  )}
                </For>
                <Show when={cart().length !== 0}>
                  <div class={styles.cartTotal}>
                    <p>
                      Cart total if paying with cash: $
                      {cart().reduce((sum, next) => sum + next.cost, 0)}
                    </p>
                    <p>
                      Cart total if paying with credit card / venmo / paypal: $
                      {Math.round(
                        (cart().reduce((sum, next) => sum + next.cost, 0) *
                          1.025 +
                          0.09) *
                          100
                      ) / 100}
                    </p>
                  </div>
                </Show>
              </div>
              <div id={styles.orderForm}>
                <div id={styles.email}>
                  <input
                    type="email"
                    name="email"
                    placeholder="*Email"
                    required
                  />
                </div>
                <div id={styles.name}>
                  <input
                    type="text"
                    name="name"
                    placeholder="*Full Name"
                    required
                  />
                </div>
                <div id={styles.phone}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="*Phone Number"
                    required
                  />
                </div>
                <div id={styles.address}>
                  <input
                    type="text"
                    name="address"
                    placeholder="*Address"
                    required
                  />
                </div>
                <div id={styles.shipping}>
                  <textarea
                    name="shipping"
                    cols="10"
                    rows="3"
                    placeholder="Any extra details needed for delivery&#10;(not required)&#10;Are you a student or staff at CHS and want them delivered to you at CHS on Monday, December 19th? Specify here!"
                    spellcheck
                  ></textarea>
                </div>
                <div id={styles.deliveryTexts}>
                  <p>Check box to get delivery texts</p>
                  <input type="checkbox" name="deliveryTexts" />
                </div>
                <div id={styles.newsletter}>
                  <p>
                    Check box to sign up for occasional email updates about
                    Tuxedo Cupcakes
                  </p>
                  <input type="checkbox" name="newsletter" />
                </div>
                <div id={styles.placeOrder} ref={placeOrderButton}>
                  <input type="submit" value="Place Order" /> (* = required)
                </div>
              </div>
            </form>
            <div id={styles.orderStatus}>
              <Switch>
                <Match when={searchParams.orderStatus === '201'}>
                  Order placed!
                  <br />
                  <br />
                  <br />
                </Match>
                <Match when={searchParams.orderStatus === '409'}>
                  An unknown error occurred. Try again.
                  <br />
                  <br />
                  <br />
                </Match>
                <Match
                  when={
                    searchParams.orderStatus !== '201' &&
                    searchParams.orderStatus !== '409' &&
                    searchParams.orderStatus !== undefined
                  }
                >
                  An unknown error occurred. Try again.
                  <br />
                  <br />
                  <br />
                </Match>
              </Switch>
            </div>

            <p>
              The deadline for orders is Thursday, December 15th.
              <br /> <br />
              Sign up to be updated about this virtual market and future virtual
              markets, as well as other news about Tuxedo Cupcakes:
            </p>
            <EmailForm />
          </div>
        </Show>

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

async function placeOrder(
  event: SubmitEvent,
  setSearchParams: any,
  setCart: any
) {
  event.preventDefault();
  let email = (
    event.target.children[1].children[0].children[0] as HTMLInputElement
  ).value;
  let name = (
    event.target.children[1].children[1].children[0] as HTMLInputElement
  ).value;
  let phone = (
    event.target.children[1].children[2].children[0] as HTMLInputElement
  ).value;
  let address = (
    event.target.children[1].children[3].children[0] as HTMLInputElement
  ).value;
  let deliveryInfo = (
    event.target.children[1].children[4].children[0] as HTMLTextAreaElement
  ).value;
  let textDeliveryUpdates = (
    event.target.children[1].children[5].children[1] as HTMLInputElement
  ).checked;
  let newsletter = (
    event.target.children[1].children[6].children[1] as HTMLInputElement
  ).checked;

  let cartItems: HTMLDivElement[] =
    document.getElementsByClassName('cart-item');
  let cart = Array.from(cartItems, (item) => ({
    item: item.children[0].textContent,
    flavor:
      item.children[1].tagName === 'TEXTAREA' ? item.children[1].value : '',
    cost:
      item.children[1].tagName === 'TEXTAREA'
        ? item.children[2].value
        : item.children[1].value,
  }));

  const supabase = createClient(
    'https://rxznihvftodgtjdtzbyr.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
  );
  let response = await supabase.from('orders').insert({
    email,
    name,
    phone,
    address,
    order: JSON.stringify(cart),
    deliveryInfo,
    textDeliveryUpdates,
    newsletter,
  });
  console.log(response.status);
  setSearchParams({ orderStatus: response.status });
  if (response.status == 201) {
    (
      event.target.children[1].children[0].children[0] as HTMLInputElement
    ).value = '';
    (
      event.target.children[1].children[1].children[0] as HTMLInputElement
    ).value = '';
    (
      event.target.children[1].children[2].children[0] as HTMLInputElement
    ).value = '';
    (
      event.target.children[1].children[3].children[0] as HTMLInputElement
    ).value = '';
    (
      event.target.children[1].children[4].children[0] as HTMLTextAreaElement
    ).value = '';
    (
      event.target.children[1].children[5].children[1] as HTMLInputElement
    ).checked = false;
    (
      event.target.children[1].children[6].children[1] as HTMLInputElement
    ).checked = false;
  }
  setCart([]);
}
