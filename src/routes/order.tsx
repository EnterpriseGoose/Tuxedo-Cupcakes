import Layout from '~/components/Layout';
import styles from './order.module.scss';
import {
  For,
  Match,
  Show,
  Switch,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from 'solid-js';
import { createClient } from '@supabase/supabase-js';
import { A, useSearchParams } from 'solid-start';
import EmailForm from '~/components/EmailForm';

const EMAIL_VALIDATION_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PHONE_VALIDATION_REGEX =
  /^\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/;

const PRODUCTS = [
  {
    name: '1 regular cupcake',
    cost: 4,
    custom: 'flavor',
    group: 1,
    id: 0,
    customValue: '',
  },
  {
    name: '2 regular cupcakes',
    cost: 8,
    custom: 'flavor',
    group: 1,
    id: 0,
    customValue: '',
  },
  {
    name: '4 regular cupcakes',
    cost: 16,
    custom: 'flavor',
    group: 1,
    id: 0,
    customValue: '',
  },
  {
    name: '6 regular cupcakes',
    cost: 20,
    custom: 'flavor',
    group: 1,
    id: 0,
    customValue: '',
  },
  {
    name: '12 regular cupcakes',
    cost: 40,
    custom: 'flavor',
    group: 1,
    id: 0,
    customValue: '',
  },
  {
    name: '1 mini cupcake',
    cost: 2,
    custom: 'flavor',
    group: 2,
    id: 0,
    customValue: '',
  },
  {
    name: '6 mini cupcakes',
    cost: 10,
    custom: 'flavor',
    group: 2,
    id: 0,
    customValue: '',
  },
  {
    name: '12 mini cupcakes',
    cost: 20,
    custom: 'flavor',
    group: 2,
    id: 0,
    customValue: '',
  },
];

interface Discount {
  code: string;
  discount: number;
  type: string;
  used: boolean;
}

interface FormData {
  email: string;
  name: string;
  phone: string;
  extra: string;
  newsletter: boolean;
  saveData: boolean;
  discount: Discount;
}

var nextID = 0;
var lastProductAdded = 0;
var lastProductRemoved = 0;

export default function Order() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = createSignal(PRODUCTS);
  const [formState, setFormState] = createSignal(0);
  const [completedPage, setCompletedPage] = createSignal(false);

  const [formData, setFormData] = createSignal<FormData>({
    email: '',
    name: '',
    phone: '',
    extra: '',
    newsletter: false,
    saveData: false,
    discount: {
      code: '',
      discount: 0,
      type: 'PERCENT',
      used: true,
    },
  });
  const [cart, setCart] = createSignal([], { equals: false });

  const [prevCartRetrieved, setPrevCartRetrieved] = createSignal(false);

  let discountCodeElem: HTMLInputElement;

  createEffect(
    (prevState: any) => {
      if (
        prevState.cartLen == cart().length &&
        prevState.completedPage == completedPage() &&
        prevState.formState == formState()
      ) {
        console.log('aborted');
        return {
          cart: cart().length,
          completedPage: completedPage(),
          formState: formState(),
        };
      }
      if (formState() === 0) {
        // #NOTE DISABLE_ORDERS
        setCompletedPage(true); //setCompletedPage(true);
      }
      if (formState() === 1 && cart().length > 0) {
        // #NOTE DISABLE_ORDERS
        setCompletedPage(true); //setCompletedPage(true);
      } else if (formState() === 1) {
        setCompletedPage(false);
      }
      if (formState() === 2) checkFlavors();
      if (formState() === 3) checkDetailInputs();
      if (formState() === 4) {
        checkCode(0);
        setTimeout(() => {
          setCompletedPage(true);
        }, 1500);
      }

      let progress = formState();
      if (completedPage() && formState() < 5) {
        progress += 0.5;
        (document.getElementById('nextButton') as HTMLInputElement).disabled =
          false;
      } else if (formState() < 5) {
        (document.getElementById('nextButton') as HTMLInputElement).disabled =
          true;
      }
      document
        .getElementById('progress')
        .style.setProperty('--progress', ((progress - 1) / 4).toString());

      if (
        prevState.formState !== formState() &&
        formState() !== 0 &&
        document.getElementsByTagName('h3').length > 0
      ) {
        document.getElementsByTagName('h3')[0].scrollIntoView();
      } /* else if (prevState.formState !== formState() && formState() == 0 && document.getElementsByTagName('h2').length > 0) {
				document.getElementsByTagName('h2')[0].scrollIntoView()
			}*/
      console.log('big effect');
      console.log(cart());

      // #NOTE DISABLE_ORDERS
      //setCompletedPage(false);

      return {
        cartLen: cart().length,
        completedPage: completedPage(),
        formState: formState(),
      };
    },
    { cart, completedPage, formState }
  );

  createEffect(() => {
    if (prevCartRetrieved()) {
      window.localStorage.setItem('cart', JSON.stringify(cart()));
      window.localStorage.setItem('formData', JSON.stringify(formData()));
      if (formState() < 5) {
        window.localStorage.setItem('formState', formState().toString());
      } else {
        window.localStorage.setItem('formState', '0');
      }

      console.log('ooo');
    }
  });

  onMount(() => {
    fillProductList(window.innerWidth, products(), setProducts);

    setCart(JSON.parse(window.localStorage.getItem('cart') ?? '[]'));
    setFormData(
      JSON.parse(
        window.localStorage.getItem('formData') ??
          JSON.stringify({
            email: '',
            name: '',
            phone: '',
            extra: '',
            newsletter: false,
            saveData: false,
            discount: {
              code: '',
              discount: 0,
              type: 'PERCENT',
              used: true,
            },
          })
      )
    );
    setFormState(parseInt(window.localStorage.getItem('formState') ?? '0'));
    console.log('iii');
    checkFlavors();
    setPrevCartRetrieved(true);
    checkCode(0);
  });

  const checkFlavors = () => {
    const flavorInputs = document.getElementsByClassName(
      'flavor-input'
    ) as HTMLCollectionOf<HTMLTextAreaElement>;
    if (flavorInputs.length === 0 && formState() === 2) {
      setCompletedPage(false);
      return;
    }
    let allFilled = true;
    let tempCart = cart();
    for (let input of flavorInputs) {
      if (input.value == '') allFilled = false;

      let item = tempCart.find((i) => i.id.toString() == input.id);
      item.customValue = input.value;
    }
    setCart(tempCart);
    if (formState() === 2) setCompletedPage(allFilled);
  };

  const checkDetailInputs = () => {
    let nameInput = document.getElementById('nameInput') as HTMLInputElement;
    let emailInput = document.getElementById('emailInput') as HTMLInputElement;
    let phoneInput = document.getElementById('phoneInput') as HTMLInputElement;
    let toAddInput = document.getElementById(
      'toAddInput'
    ) as HTMLTextAreaElement;
    let newsletterInput = document.getElementById(
      'newsletterInput'
    ) as HTMLInputElement;
    let saveDetailsInput = document.getElementById(
      'saveDetailsInput'
    ) as HTMLInputElement;

    if (
      emailInput.value != '' &&
      emailInput.value.match(EMAIL_VALIDATION_REGEX) == null &&
      document.activeElement != emailInput
    ) {
      emailInput.setCustomValidity('Please enter a valid email address');
      emailInput.setAttribute('valid', 'false');
      console.log('invalid email');
    } else {
      emailInput.setCustomValidity('');
      emailInput.setAttribute('valid', 'true');
    }

    if (
      phoneInput.value != '' &&
      phoneInput.value.match(PHONE_VALIDATION_REGEX) == null &&
      document.activeElement != phoneInput
    ) {
      phoneInput.setCustomValidity(
        'Please enter a valid phone number (or none at all)'
      );
      phoneInput.setAttribute('valid', 'false');

      console.log('invalid phone');
    } else {
      phoneInput.setCustomValidity('');
      phoneInput.setAttribute('valid', 'true');
    }
    console.log({
      email: emailInput.value.match(EMAIL_VALIDATION_REGEX),
      phone: phoneInput.value.match(PHONE_VALIDATION_REGEX),
    });
    console.log({
      val1: phoneInput.value != '',
      val2: phoneInput.value.match(PHONE_VALIDATION_REGEX) == null,
      val3: document.activeElement != phoneInput,
    });

    if (
      nameInput.value !== '' &&
      emailInput.value.match(EMAIL_VALIDATION_REGEX) !== null &&
      formState() === 3 &&
      (phoneInput.value == '' ||
        phoneInput.value.match(PHONE_VALIDATION_REGEX) !== null)
    ) {
      setCompletedPage(true);
    } else {
      setCompletedPage(false);
    }

    setFormData({
      email: emailInput.value,
      name: nameInput.value,
      phone: phoneInput.value,
      extra: toAddInput.value,
      newsletter: newsletterInput.checked,
      saveData: saveDetailsInput.checked,
      discount: formData().discount,
    });
  };

  let checkCode = async (tryCount?: number) => {
    let target = document.getElementById('code') as HTMLInputElement;
    if (!target && tryCount < 3) {
      console.log('trying again to check code, try #: ' + tryCount);
      setTimeout(() => {
        checkCode(tryCount + 1);
      }, 200);
      return;
    } else if (tryCount >= 3) {
      console.log('Unable to check code');
      return;
    }
    let successElem =
      target.parentElement.getElementsByClassName('codeValid')[0];
    let code = target.value.replaceAll(/\D/g, '').substring(0, 10);
    target.value = parseDiscountCode(code);

    if (parseInt(code).toString().length !== 9) {
      successElem.textContent = '';
      setFormData({
        ...formData(),
        discount: { code, discount: 0, type: '', used: true },
      });
      return;
    }
    const supabase = createClient(
      'https://rxznihvftodgtjdtzbyr.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
    );
    let { error, data } = await supabase.rpc('get_discount', {
      testcode: code,
    });
    let discount = data as any as Discount;

    if (error) {
      let errorNode = document.createElement('p');
      errorNode.textContent =
        'Unknown error occured when checking code: ' +
        error.code +
        '\nTry refreshing and trying again';
      target.parentElement.after(errorNode);
      console.log(error);
      setFormData({
        ...formData(),
        discount: { code, discount: 0, type: '', used: true },
      });
    }
    if (discount) {
      target.setAttribute('valid', 'true');
      if (discount.used) {
        target.setAttribute('valid', 'used');
        successElem.textContent = 'Code Already Used';
      } else if (discount.type === 'AMOUNT') {
        successElem.textContent = '-$' + discount.discount;
      } else if (discount.type === 'PERCENT') {
        successElem.textContent = '-' + discount.discount + '%';
      } else {
        successElem.textContent = '✓';
      }

      setFormData({ ...formData(), discount });
    } else {
      target.setAttribute('valid', 'false');
      successElem.textContent = '✖';
    }
    console.log(formData());
  };

  let flavorsElem = (
    <div class={styles.flavorsList}>
      <h4>Flavors available for this pop-up:</h4>
      <p>Vanilla</p>
      <p>Chocolate</p>
      <p>Strawberry</p>
      <p>Lemon Blueberry</p>
      <p>Chocolate Matcha</p>
      <A href="/gallery/egg-basket">
        <p>Easter Egg Basket (+$1 per)</p>
      </A>
    </div>
  );

  let cartTotalElem = (crossOut?: boolean) => {
    let total = cart().reduce((sum, next) => sum + next.cost, 0);
    let paypalTotal = Math.round((total * 1.037 + 0.5) * 100) / 100;
    if (total == 0) paypalTotal = 0;

    let discount = formData().discount;

    if (discount && !discount.used && discount.discount > 0) {
      if (cart().length === 0) return <></>;

      let discountedTotal = total;
      switch (discount.type) {
        case 'PERCENT':
          discountedTotal -= discountedTotal * (discount.discount / 100);
          break;
        case 'AMOUNT':
          discountedTotal -= discount.discount;
      }
      let discountedPaypalTotal =
        Math.round((discountedTotal * 1.037 + 0.5) * 100) / 100;

      if (crossOut) {
        return (
          <div class={styles.cartTotal}>
            <p>
              Total with venmo: $<i class={styles.crossedOut}>{total}</i> →{' '}
              {discountedTotal}
            </p>
            <p>
              Total with credit&nbsp;card / paypal: $
              <i class={styles.crossedOut}>{paypalTotal}</i> →{' '}
              {discountedPaypalTotal}
            </p>
          </div>
        );
      } else {
        return (
          <div class={styles.cartTotal}>
            <p>Total with venmo: ${discountedTotal}</p>
            <p>
              Total with credit&nbsp;card / paypal: ${discountedPaypalTotal}
            </p>
          </div>
        );
      }
    }

    return (
      <div class={styles.cartTotal}>
        <p>Total with venmo: ${total}</p>
        <p>Total with credit&nbsp;card / paypal: ${paypalTotal}</p>
      </div>
    );
  };

  return (
    <Layout mini hideFooter desc="Place an order today!">
      <div class={styles.order}>
        <Switch>
          <Match when={formState() === 0}>
            <h2>Place an order today!</h2>
            <p class={styles.instruction}>
              Place an order now for delivery (or pickup) on Easter Weekend!
              (March 30-31)
              <br />
              <br />
              After you select your flavors and fill out a few details on this
              page, we will email you with details on how to pay and when you
              would like the cupcakes.
              <br />
              {/* If you want to get notified when our next pop up will be, you can
              sign up for our newsletter: <EmailForm /> */}
              <br />
              Want to place an order for a different time? Shoot us an email at{' '}
              <a
                href="mailto:hello@tuxedocupcakes.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@tuxedocupcakes.com
              </a>
            </p>
          </Match>
          <Match when={formState() === 1}>
            <h3>Select your Boxes</h3>
            <p class={styles.instruction}>
              Select how many cupcakes you would like to purchase. Each box can
              have multiple flavors. Flavors will be chosen at the next step.
            </p>
            <div class={`${styles.flavorDivide} ${styles.boxes}`}>
              <div id={styles.productGrid}>
                <For each={products()}>
                  {(product, i) =>
                    product.name !== 'gap' ? (
                      <div
                        onClick={() => {
                          if (lastProductAdded + 250 < Date.now()) {
                            let newProduct = { ...product };
                            newProduct.id = Date.now() + nextID++;
                            setCart([...cart(), newProduct]);
                            lastProductAdded = Date.now();
                          }
                        }}
                        onMouseDown={(e) => {
                          e.currentTarget.setAttribute('selected', 'true');
                          e.currentTarget.style.setProperty(
                            'border-radius',
                            '0'
                          );
                        }}
                        onMouseUp={(e) => {
                          e.currentTarget.setAttribute('selected', '');
                          e.currentTarget.style.setProperty(
                            'border-radius',
                            'calc(1 * min(90vw + 400px, min(60vw + 600px, 1200px))/100)'
                          );
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.setAttribute('selected', '');
                          e.currentTarget.style.setProperty(
                            'border-radius',
                            'calc(1 * min(90vw + 400px, min(60vw + 600px, 1200px))/100)'
                          );
                        }}
                      >
                        <p class={styles.productName}>{product.name}</p>
                        <p class={styles.productCost}>${product.cost}</p>
                      </div>
                    ) : (
                      <p></p>
                    )
                  }
                </For>
              </div>
              <div class={`${styles.leftBar} ${styles.boxes}`}>
                {flavorsElem}
                <div class={styles.cartBox}>
                  <h4>Cart:</h4>
                  <div id={styles.cart}>
                    <For
                      each={cart()}
                      fallback={<p>Your cart is currently empty</p>}
                    >
                      {(item, i) => (
                        <div class={styles.cartItem} id={item.id.toString()}>
                          <p class={styles.name}>{item.name}</p>
                          <p class={styles.cost}>${item.cost}</p>
                          <button
                            onClick={() => {
                              if (lastProductRemoved + 250 < Date.now()) {
                                let cartItems = cart();
                                cartItems.splice(i(), 1);
                                setCart(cartItems);
                                lastProductRemoved - Date.now();
                              }
                            }}
                          >
                            x
                          </button>
                        </div>
                      )}
                    </For>
                  </div>
                  {cartTotalElem(false)}
                </div>
              </div>
            </div>
          </Match>
          <Match when={formState() === 2}>
            <h3>Select your Flavors</h3>
            <p class={styles.instruction}>
              Select the flavor(s) of cupcakes you would like.
            </p>
            <div class={`${styles.flavorDivide} ${styles.flavors}`}>
              <div id={styles.cart}>
                <h4>Cart:</h4>
                <For
                  each={cart()}
                  fallback={<p>Your cart is currently empty</p>}
                >
                  {(item, i) => (
                    <div class={styles.cartItem}>
                      <div class={`${styles.name} ${styles.min}`}>
                        {item.name}
                      </div>
                      <Show when={item.custom === 'flavor'}>
                        <textarea
                          class="flavor-input"
                          id={item.id.toString()}
                          name="flavors"
                          placeholder="Flavor(s) (required)"
                          required
                          spellcheck
                          onInput={checkFlavors}
                          value={item.customValue}
                        ></textarea>
                      </Show>
                      <p class={styles.cost}>${item.cost}</p>
                      <button
                        onClick={() => {
                          if (lastProductRemoved + 250 < Date.now()) {
                            let cartItems = cart();
                            cartItems.splice(i(), 1);
                            setCart(cartItems);
                            lastProductRemoved - Date.now();
                          }
                        }}
                      >
                        x
                      </button>
                    </div>
                  )}
                </For>
                {cartTotalElem(false)}
              </div>

              <div class={`${styles.leftBar} ${styles.flavors}`}>
                {flavorsElem}
                <p class={styles.emailDiffFlavor}>
                  Want a flavor not listed?{' '}
                  <a
                    href="mailto:hello@tuxedocupcakes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Contact us
                  </a>{' '}
                  and we'll see what we can do!
                </p>
              </div>
            </div>
          </Match>
          <Match when={formState() === 3}>
            <h3>A few last details</h3>
            <p class={styles.instruction}>
              Just fill out a few details so we know where to contact you.
            </p>
            <div id={styles.details}>
              <label>Name</label>
              <div class={styles.textInput}>
                <input
                  type="text"
                  id="nameInput"
                  oninput={checkDetailInputs}
                  placeholder="(required)"
                  value={formData().name}
                />
              </div>
              <label>Email</label>
              <div class={styles.textInput}>
                <input
                  type="email"
                  id="emailInput"
                  oninput={checkDetailInputs}
                  placeholder="(required)"
                  value={formData().email}
                />
              </div>
              <label>Phone</label>
              <div class={styles.textInput}>
                <input
                  type="tel"
                  id="phoneInput"
                  oninput={checkDetailInputs}
                  value={formData().phone}
                />
              </div>
              <div class={styles.toAdd}>
                <label>Anything else you wish to add?</label>
                <textarea
                  id="toAddInput"
                  oninput={checkDetailInputs}
                  value={formData().extra}
                />
              </div>
              <div class={styles.newsletter}>
                <label>
                  Do you want to recieve occasional email
                  <br />
                  updates about Tuxedo Cupcakes?
                </label>

                <input
                  type="checkbox"
                  id="newsletterInput"
                  oninput={checkDetailInputs}
                  checked={formData().newsletter}
                ></input>
              </div>
              <div class={styles.saveDetails}>
                <label>Save my info for next time</label>

                <input
                  type="checkbox"
                  id="saveDetailsInput"
                  oninput={checkDetailInputs}
                  checked={formData().saveData}
                ></input>
              </div>
            </div>
          </Match>
          <Match when={formState() === 4}>
            <h3>Review your order</h3>
            <div class={`${styles.flavorDivide} ${styles.details}`}>
              <div id={styles.cart}>
                <h4>Cart:</h4>
                <For
                  each={cart()}
                  fallback={<p>Your cart is currently empty</p>}
                >
                  {(item, i) => (
                    <div class={styles.cartItem}>
                      <div class={`${styles.name} ${styles.min}`}>
                        {item.name}
                      </div>
                      <div class={styles.displayFlavors}>
                        <p>{item.customValue}</p>
                      </div>
                      <p class={styles.cost}>${item.cost}</p>
                    </div>
                  )}
                </For>
                <div class={styles.discount}>
                  <label for="code">Discount Code:</label>
                  <input
                    class={styles.code}
                    type="text"
                    name="code"
                    id="code"
                    placeholder="000-000-000"
                    minLength={11}
                    maxlength={11}
                    spellcheck={false}
                    value={parseDiscountCode(
                      formData().discount ? formData().discount.code : ''
                    )}
                    required
                    onInput={() => {
                      checkCode();
                    }}
                    ref={discountCodeElem}
                  />
                  <label for="code" class="codeValid"></label>
                </div>
                {cartTotalElem(true)}
                <div class={styles.orderDetails}>
                  <p>
                    When you place your order, we'll review it and then email
                    you about payment.
                  </p>
                </div>
              </div>

              <div class={`${styles.leftBar} ${styles.details}`}>
                <h4>Your details:</h4>
                <p>
                  Name: {formData().name}
                  <br />
                  Email: {formData().email}
                  <br />
                  {formData().phone ? (
                    <>
                      Phone: {formData().phone}
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  {formData().extra ? (
                    <>
                      Extra: {formData().extra}
                      <br />
                    </>
                  ) : (
                    ''
                  )}
                  Newsletter: {formData().newsletter ? 'Yes' : 'No'}
                  <br />
                  <br />
                </p>
                <p class={styles.emailDiffFlavor}>
                  Need a special request? Have any questions about your order?
                  Just contact us at{' '}
                  <a
                    href="mailto:hello@tuxedocupcakes.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    hello@tuxedocupcakes.com
                  </a>
                  !
                </p>
              </div>
            </div>
          </Match>
          <Match when={formState() === 5}>
            <h2>Order Placed Successfully!</h2>
            <p class={styles.instruction}>
              Your order has been placed and is now processing. As soon as we
              confirm it, we'll send you an email with details on how to pay and
              how to pick up your order.
              <br /> <br />
              Have any questions about your order? Just send us an email at{' '}
              <a
                href="mailto:hello@tuxedocupcakes.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                hello@tuxedocupcakes.com
              </a>
            </p>
          </Match>
        </Switch>
        <Show when={formState() < 5}>
          <div class={styles.navigation}>
            <Show when={formState() > 0}>
              <button
                class={styles.backButton}
                id="backButton"
                onClick={() => {
                  setFormState(formState() - 1);
                }}
              >
                ← Back
              </button>
            </Show>
            <button
              disabled
              class={`${
                formState() == 4
                  ? `button ${styles.placeOrder}`
                  : styles.nextButton
              } `}
              id="nextButton"
              onClick={async () => {
                if (formState() === 4) {
                  const supabase = createClient(
                    'https://rxznihvftodgtjdtzbyr.supabase.co',
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ4em5paHZmdG9kZ3RqZHR6YnlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg5MTgzNjUsImV4cCI6MTk4NDQ5NDM2NX0.Hqb-OC8vN2zoMZobwouS4QTGA0X0KLBQzM3O8btvwLE'
                  );
                  let response = await supabase.from('orders').insert({
                    email: formData().email,
                    name: formData().name,
                    phone: formData().phone,
                    order: JSON.stringify(cart()),
                    extraInfo: formData().extra,
                    newsletter: formData().newsletter,
                    discount: formData().discount,
                  });
                  console.log(response.status);
                  setSearchParams({ orderStatus: response.status });
                  if (response.status == 201) {
                    if (formData().discount && !formData().discount.used) {
                      let result = await supabase.rpc('use_discount', {
                        usecode: formData().discount.code,
                      });
                      console.log(result);
                    }

                    setCart([]);
                    setFormState(5);
                    if (!formData().saveData) {
                      setFormData({
                        email: '',
                        name: '',
                        phone: '',
                        extra: '',
                        newsletter: false,
                        saveData: false,
                        discount: undefined,
                      });
                    } else {
                      setFormData({
                        ...formData(),
                        discount: {
                          code: '',
                          discount: 0,
                          type: 'PERCENT',
                          used: true,
                        },
                      });
                    }
                  }
                  return;
                }
                setFormState(formState() + 1);
                setCompletedPage(false);
                if (formState() === 4) {
                  setTimeout(() => {
                    setCompletedPage(true);
                  }, 1500);
                }
              }}
            >
              {formState() == 0
                ? 'Order'
                : formState() == 4
                ? 'Place Order'
                : 'Next'}{' '}
              →
            </button>
            <Show
              when={
                searchParams.orderStatus !== undefined &&
                searchParams.orderStatus !== '201' &&
                formState() === 4
              }
            >
              <p class={styles.error}>
                An unknown error occured. Please try again.
              </p>
            </Show>
          </div>
        </Show>
        <div
          class={`${styles.progressBar} ${
            formState() === 5 ? styles.toBottom : ''
          }`}
        >
          <div class={styles.progress} id="progress" />
        </div>
      </div>
    </Layout>
  );
}

function fillProductList(innerWidth: number, products, setProducts) {
  let columns = 4;
  if (innerWidth <= 1400) columns = 3;
  if (innerWidth <= 1000) columns = 4;
  if (innerWidth <= 750) columns = 3;

  let newProducts = [];
  let group = 1;
  let inRow = 0;
  for (let product of products) {
    if (product.group === group) {
      newProducts.push(product);
      inRow = ++inRow % columns;
    } else {
      for (; inRow < columns; inRow++) {
        newProducts.push({ name: 'gap', cost: 0, custom: '', group: 0 });
      }
      newProducts.push(product);
      inRow = 1;
      group++;
    }
  }

  setProducts(newProducts);
}

function parseDiscountCode(code: string) {
  let codeString = '';
  code.split('').forEach((digit) => {
    if (codeString.length === 3 || codeString.length === 7) {
      codeString += '-';
    }
    codeString += digit;
  });
  return codeString;
}
