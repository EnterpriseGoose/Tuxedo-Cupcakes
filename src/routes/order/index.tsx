import Layout from '~/components/Layout';
import styles from './index.module.scss';
import { For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import CupcakeBox, { AVAILABLE_SIZES, FLAVORS } from '~/components/CupcakeBox';
import Cupcake from '~/components/Cupcake';
import { createClient } from '@supabase/supabase-js';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const EMAIL_VALIDATION_REGEX =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
const PHONE_VALIDATION_REGEX =
  /^\+?(9[976]\d|8[987530]\d|6[987]\d|5[90]\d|42\d|3[875]\d|2[98654321]\d|9[8543210]|8[6421]|6[6543210]|5[87654321]|4[987654310]|3[9643210]|2[70]|7|1)?\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*\d\W*(\d{1,2})$/;

const MARKETS: Market[] = [
  {
    week: new Date(2024, 5, 17, 0, 0),
    times: [
      'Friday 6/21, 3 - 8PM',
      'Saturday 6/22, 8 - 11:30AM',
      'Saturday 6/22, 1 - 7PM',
      'Sunday 6/23, 8:30AM - 1PM',
    ],
    names: [
      'Parsippany Farmers Market',
      'Chatham Farmers Market',
      'Morris County Pride Festival',
      'Morristown Farmers Market',
    ],
    flavors: [
      FLAVORS.VANILLA_VANILLA,
      FLAVORS.VANILLA_CHOCOLATE,
      FLAVORS.CHOCOLATE_VANILLA,
      FLAVORS.CHOCOLATE_CHOCOLATE,
      FLAVORS.STRAWBERRY,
      FLAVORS.CHOCOLATE_STRAWBERRY,
      FLAVORS.COCONUT_PASSION_FRUIT,
      FLAVORS.MOCHA,
    ],
  },
  {
    week: new Date(2024, 5, 24, 0, 0),
    times: ['Friday 6/28, 3 - 7PM', 'Saturday 6/29, 8AM - 1PM'],
    names: ['Parsippany Farmers Market', 'Chatham Farmers Market'],
    flavors: [
      FLAVORS.VANILLA_VANILLA,
      FLAVORS.VANILLA_CHOCOLATE,
      FLAVORS.CHOCOLATE_VANILLA,
      FLAVORS.CHOCOLATE_CHOCOLATE,
      FLAVORS.STRAWBERRY,
      FLAVORS.CHOCOLATE_STRAWBERRY,
      FLAVORS.SALTED_CARAMEL_CASHEW,
      FLAVORS.CHOCOLATE_RASPBERRY,
    ],
  },
  {
    week: new Date(2024, 6, 1, 0, 0),
    times: [
      'Friday 7/5, 3 - 8PM',
      'Saturday 7/6, 8AM - 1PM',
      'Sunday 7/7, 8:30AM - 1PM',
    ],
    names: [
      'Parsippany Farmers Market',
      'Chatham Farmers Market',
      'Morristown Farmers Market',
    ],
    flavors: [
      FLAVORS.VANILLA_VANILLA,
      FLAVORS.VANILLA_CHOCOLATE,
      FLAVORS.CHOCOLATE_VANILLA,
      FLAVORS.CHOCOLATE_CHOCOLATE,
      FLAVORS.STRAWBERRY,
      FLAVORS.CHOCOLATE_STRAWBERRY,
      FLAVORS.CHOCOLATE_CHERRY,
      FLAVORS.SALTED_CARAMEL_CASHEW,
    ],
  },
  {
    week: new Date(2024, 6, 8, 0, 0),
    times: ['Friday 7/12, 3 - 8PM', 'Saturday 7/13, 8AM - 1PM'],
    names: ['Parsippany Farmers Market', 'Chatham Farmers Market'],
    flavors: [
      FLAVORS.VANILLA_VANILLA,
      FLAVORS.VANILLA_CHOCOLATE,
      FLAVORS.CHOCOLATE_VANILLA,
      FLAVORS.CHOCOLATE_CHOCOLATE,
      FLAVORS.STRAWBERRY,
      FLAVORS.CHOCOLATE_STRAWBERRY,
      FLAVORS.LEMON_PISTACHIO,
      FLAVORS.COCONUT_RASPBERRY,
    ],
    title: 'July 8-14',
  },
  {
    week: new Date(2024, 6, 15, 0, 0),
    times: ['Friday 7/19, 3 - 8PM', 'Saturday 7/20, 8AM - 1PM'],
    names: ['Parsippany Farmers Market', 'Chatham Farmers Market'],
    flavors: [
      FLAVORS.VANILLA_VANILLA,
      FLAVORS.VANILLA_CHOCOLATE,
      FLAVORS.CHOCOLATE_VANILLA,
      FLAVORS.CHOCOLATE_CHOCOLATE,
      FLAVORS.STRAWBERRY,
      FLAVORS.CHOCOLATE_STRAWBERRY,
      FLAVORS.LEMON_PISTACHIO,
      FLAVORS.SALTED_CARAMEL_CASHEW,
    ],
    title: 'July 15-21',
  },
];

const mobileCheck = function () {
  if (typeof window == 'undefined') return false;
  let check = false;

  (function (a) {
    if (
      /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
        a
      ) ||
      /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
        a.substr(0, 4)
      )
    )
      check = true;
    // @ts-ignore
  })(window.navigator.userAgent || window.navigator.vendor || window.opera);
  return check;
};

let activeMarkets: Market[] = [];

export default function Order() {
  let [mobileBrowser, setMobileBrowser] = createSignal(false);
  onMount(() => {
    setMobileBrowser(mobileCheck());
  });
  let [pageUp, setPageUp] = createSignal(true);
  let [state, setState] = createSignal(2);
  let [marketSelect, setMarketSelect] = createSignal(0);
  let [cupcakeSelectStep, setCupcakeSelectStep] = createSignal(2);
  let [order, setOrder] = createSignal<Order>(
    {
      market: { week: new Date(), times: [], names: [], flavors: [] },
      time: '',
      name: '',
      boxes: [],
      info: {
        name: '',
        email: '',
        phone: '',
        extra: '',
        newsletter: false,
        save: false,
        discount: {
          code: '',
          discount: 0,
          type: '',
          used: true,
        },
      },
    },
    { equals: false }
  );
  const updateOrder = (partialOrder: DeepPartial<Order>) => {
    setOrder(Object.assign(order(), partialOrder));
  };
  updateOrder({
    market: MARKETS[3],
    boxes: [
      {
        type: { price: 100, quantity: 12, regular: true },
        cupcakes: [
          ...new Array(6).fill(FLAVORS.STRAWBERRY),
          ...new Array(6).fill(FLAVORS.CHOCOLATE_CHOCOLATE),
        ],
      },
      {
        type: { price: 100, quantity: 12, regular: true },
        cupcakes: [
          ...new Array(6).fill(FLAVORS.STRAWBERRY),
          ...new Array(6).fill(FLAVORS.CHOCOLATE_CHOCOLATE),
        ],
      },
      {
        type: { price: 100, quantity: 12, regular: true },
        cupcakes: [
          ...new Array(6).fill(FLAVORS.STRAWBERRY),
          ...new Array(6).fill(FLAVORS.CHOCOLATE_CHOCOLATE),
        ],
      },
      {
        type: { price: 100, quantity: 12, regular: true },
        cupcakes: [
          ...new Array(6).fill(FLAVORS.STRAWBERRY),
          ...new Array(6).fill(FLAVORS.CHOCOLATE_CHOCOLATE),
        ],
      },
    ],
    info: {
      name: 'Olive',
      email: 'olive@tuxedocupcakes.com',
      phone: '8622060280',
    },
  });
  let [activeBox, setActiveBox] = createSignal<Box>(
    {
      cupcakes: [],
      type: { price: 0, quantity: 0, regular: true },
    },
    { equals: false }
  );
  let [activeBoxEditBuffer, setActiveBoxEditBuffer] = createSignal<Box>();
  setActiveBox();
  let [activeBrush, setActiveBrush] = createSignal<Flavor>();
  let [extraDetailsValid, setExtraDetailsValid] = createSignal(false);

  activeMarkets = [];
  if (activeMarkets.length == 0) {
    for (let market of MARKETS) {
      if (activeMarkets.length >= 3) continue;
      if (market.week.getTime() + 345600000 > Date.now()) {
        activeMarkets.push(market);
      }
    }
  }

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
      'saveInput'
    ) as HTMLInputElement;

    if (
      emailInput.value != '' &&
      emailInput.value.match(EMAIL_VALIDATION_REGEX) == null
    ) {
      emailInput.setCustomValidity('Please enter a valid email address');
      emailInput.setAttribute('valid', 'false');
      console.log('invalid email');
    } else {
      emailInput.setCustomValidity('');
      emailInput.setAttribute('valid', 'true');
    }

    let cleanPhone = phoneInput.value.replaceAll(/\D+/g, '');
    if (cleanPhone.length > 10) cleanPhone = cleanPhone.substring(0, 10);
    phoneInput.value = parsePhoneNumber(cleanPhone);
    if (
      phoneInput.value != '' &&
      phoneInput.value.match(PHONE_VALIDATION_REGEX) == null
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

    if (
      nameInput.value !== '' &&
      emailInput.value.match(EMAIL_VALIDATION_REGEX) !== null &&
      (phoneInput.value == '' ||
        phoneInput.value.match(PHONE_VALIDATION_REGEX) !== null)
    ) {
      setExtraDetailsValid(true);
    } else {
      setExtraDetailsValid(false);
    }

    updateOrder({
      info: {
        email: emailInput.value,
        name: nameInput.value,
        phone: phoneInput.value,
        extra: toAddInput.value,
        newsletter: newsletterInput.checked,
        save: saveDetailsInput.checked,
        discount: order().info.discount,
      },
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
      updateOrder({
        info: {
          ...order().info,
          discount: { code, discount: 0, type: '', used: true },
        },
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
      updateOrder({
        info: {
          ...order().info,
          discount: { code, discount: 0, type: '', used: true },
        },
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

      updateOrder({
        info: {
          ...order().info,
          discount,
        },
      });
    } else {
      target.setAttribute('valid', 'false');
      successElem.textContent = '✖';
    }
    console.log(order().info);
  };

  return (
    <Layout
      hideFooter
      desc="Place a pre-order to get your cupcakes quickly at the market!"
    >
      <div class={styles.order}>
        <div class={styles.explainer}>
          <h2>Order cupcakes today!</h2>
          <p>
            Place a pre-order of cupcakes for pickup at a farmers' market to
            ensure you can get the flavors you want.
            <br />
            <br />
            <button
              class="button"
              onClick={async (e) => {
                e.target.classList.add('submitted');
                setPageUp(true);
                window.scrollTo(0, 10000);
                await sleep(1000);
                e.target.classList.remove('submitted');
              }}
              disabled={mobileBrowser()}
            >
              Place order now
            </button>
            <Show when={mobileBrowser()}>
              <p>
                Unfortunately, this is currently a desktop-only tool. Please use
                a desktop to place an order via this page, or send me an email.
              </p>
            </Show>
            <br />
            <br />
            Want cupcakes for another time or something else special? Send us an
            email at{' '}
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
        <div
          class={`${styles.orderPage} ${pageUp() ? styles.up : ''}`}
          id="orderPage"
        >
          <button
            class={styles.closeOrderPage}
            onClick={() => {
              setPageUp(false);
            }}
          >
            <img src="/images/arrow.svg" />
          </button>

          <div class={styles.orderPageContent}>
            <div
              class={`${styles.pageBox} ${styles.marketChoice} ${
                state() < 0
                  ? styles.right
                  : state() > 0
                  ? styles.left
                  : styles.active
              }`}
              id="state0"
            >
              <h2>Choose Your Pickup Market (& Date)</h2>
              <div
                class={styles.marketGrid}
                style={{ left: `calc(15vw - ${marketSelect() * 82.5}vw)` }}
              >
                <For each={activeMarkets}>
                  {(market, i) => (
                    <>
                      <div class={styles.marketGroup}>
                        <Show when={market.title}>
                          <h3>Week of {market.title}</h3>
                        </Show>
                        <div class={styles.divider}>
                          <div class={styles.names}>
                            <For each={market.names}>
                              {(name, j) => (
                                <button
                                  class={`${styles.button} ${
                                    market.times[j()] == order().time
                                      ? styles.selected
                                      : ''
                                  }`}
                                  onClick={() => {
                                    console.log(
                                      'selected market: ' +
                                        name +
                                        ' ' +
                                        market.times[j()]
                                    );
                                    updateOrder({
                                      market,
                                      name,
                                      time: market.times[j()],
                                    });
                                    console.log(order());
                                    console.log(
                                      market.times[j()] == order().time
                                    );
                                  }}
                                >
                                  {name} -
                                  <br />
                                  <span>{market.times[j()]}</span>
                                </button>
                              )}
                            </For>
                          </div>
                          <div class={styles.flavors}>
                            <h3>Flavors:</h3>
                            <For each={market.flavors}>
                              {(flavor, j) => (
                                <>
                                  {flavor.name}
                                  <br />
                                </>
                              )}
                            </For>
                          </div>
                        </div>
                      </div>
                      <Show when={i() < activeMarkets.length - 1}>
                        <div class={styles.nextButton}>
                          <button
                            onClick={() => {
                              if (i() < marketSelect()) {
                                setMarketSelect(marketSelect() - 1);
                              } else {
                                setMarketSelect(marketSelect() + 1);
                              }
                            }}
                          >
                            <img
                              class={i() < marketSelect() ? styles.flipped : ''}
                              src="/images/arrow.svg"
                            />
                          </button>
                        </div>
                      </Show>
                    </>
                  )}
                </For>
              </div>
              <div class={styles.nextPage}>
                <button
                  class="button"
                  disabled={order().time == ''}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(1);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  Next <img src="/images/arrow.svg" />
                </button>
              </div>
            </div>

            <div
              class={`${styles.pageBox} ${styles.cupcakeChoice} ${
                state() < 1
                  ? styles.right
                  : state() >= 2
                  ? styles.left
                  : styles.active
              }`}
              id="state1"
            >
              <h2>Choose your cupcakes</h2>
              <div
                class={styles.stepGrid}
                style={{ left: `calc(15vw - ${cupcakeSelectStep() * 82.5}vw)` }}
              >
                <div class={`${styles.boxChoice} ${styles.step}`}>
                  <h2>1. Select Box</h2>
                  <div class={styles.boxGrid}>
                    <For each={AVAILABLE_SIZES}>
                      {(boxSize) => (
                        <div
                          class={styles.boxSelect}
                          style={{
                            'grid-column':
                              'span ' +
                              (boxSize.regular
                                ? Math.ceil(Math.sqrt(boxSize.quantity))
                                : Math.round(
                                    (Math.ceil(Math.sqrt(boxSize.quantity)) *
                                      2) /
                                      3
                                  )),
                          }}
                          onClick={() => {
                            setActiveBox({
                              type: boxSize,
                              cupcakes: activeBox() ? activeBox().cupcakes : [],
                            });
                            setCupcakeSelectStep(1);
                          }}
                        >
                          <CupcakeBox
                            box={{
                              type: boxSize,
                              cupcakes: [],
                            }}
                            tooltip
                          />
                        </div>
                      )}
                    </For>
                  </div>
                </div>

                <div class={styles.nextButton}>
                  <button
                    onClick={() => {
                      if (cupcakeSelectStep() > 0) {
                        setCupcakeSelectStep(cupcakeSelectStep() - 1);
                      } else {
                        setCupcakeSelectStep(cupcakeSelectStep() + 1);
                      }
                    }}
                    disabled={
                      activeBox() === undefined &&
                      order().boxes.length === 0 &&
                      cupcakeSelectStep() == 0
                    }
                  >
                    <img
                      class={cupcakeSelectStep() > 0 ? styles.flipped : ''}
                      src="/images/arrow.svg"
                    />
                  </button>
                </div>

                <div class={`${styles.flavorChoice} ${styles.step}`}>
                  <h2>2. Select Flavors</h2>
                  <div class={styles.divider}>
                    <div class={styles.boxInfo}>
                      <Show
                        when={activeBox() != undefined}
                        fallback={
                          <>
                            <h3>Select a box to continue</h3>
                          </>
                        }
                      >
                        <p>{`${activeBox().type.quantity} ${
                          activeBox().type.regular ? 'Regular' : 'Mini'
                        } - $${activeBox().type.price}`}</p>
                        <CupcakeBox
                          box={activeBox()}
                          editable={true}
                          scale={1.5}
                          brush={activeBrush()}
                          setActiveBox={setActiveBox}
                        />
                        <button
                          class={`button ${styles.addToCart}`}
                          disabled={
                            activeBox().cupcakes.filter((v) => v == undefined)
                              .length > 0 || activeBox().cupcakes.length == 0
                          }
                          onClick={async () => {
                            let boxesArray = order().boxes;
                            boxesArray.push(activeBox());
                            updateOrder({ boxes: boxesArray });
                            setCupcakeSelectStep(2);
                            await sleep(1000);
                            setActiveBox();
                            setActiveBrush();
                            if (activeBoxEditBuffer() != undefined) {
                              setActiveBox(activeBoxEditBuffer());
                              setActiveBoxEditBuffer();
                            }
                          }}
                        >
                          Put in cart
                        </button>
                      </Show>
                    </div>
                    <div class={styles.palette}>
                      <h3>Select flavor to place in box</h3>
                      <div class={styles.brushSelect}>
                        <For each={order().market.flavors}>
                          {(flavor) => (
                            <div
                              class={`${styles.cupcake} tooltip ${
                                activeBrush() != undefined &&
                                activeBrush().id == flavor.id
                                  ? styles.selected
                                  : ''
                              }`}
                              onClick={() => {
                                setActiveBrush(flavor);
                              }}
                            >
                              <span class="tooltip-text">{flavor.name}</span>
                              <Cupcake flavor={flavor} scale={1.5} size={75} />
                            </div>
                          )}
                        </For>
                      </div>
                      <div class={styles.buttons}>
                        <button
                          class="button"
                          disabled={
                            activeBox() == undefined ||
                            (activeBox().cupcakes.filter((v) => v == undefined)
                              .length == 0 &&
                              activeBox().cupcakes.length != 0) ||
                            activeBrush() == undefined
                          }
                          onClick={() => {
                            setActiveBox((box) => {
                              if (box.cupcakes.length == 0)
                                box.cupcakes = new Array(
                                  box.type.quantity
                                ).fill(activeBrush());
                              else
                                box.cupcakes = box.cupcakes.map((flavor) =>
                                  flavor == undefined ? activeBrush() : flavor
                                );
                              console.log(box);
                              return box;
                            });
                            console.log(activeBox());
                          }}
                        >
                          Fill box
                        </button>
                        <button
                          class="button"
                          disabled={
                            activeBox() == undefined ||
                            activeBox().cupcakes.filter((v) => v != undefined)
                              .length == 0 ||
                            activeBox().cupcakes.length == 0
                          }
                          onClick={() => {
                            setActiveBox({
                              type: activeBox().type,
                              cupcakes: [],
                            });
                          }}
                        >
                          Empty box
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div class={styles.nextButton}>
                  <button
                    onClick={() => {
                      if (cupcakeSelectStep() > 1) {
                        setCupcakeSelectStep(cupcakeSelectStep() - 1);
                      } else {
                        setCupcakeSelectStep(cupcakeSelectStep() + 1);
                      }
                    }}
                    disabled={
                      order().boxes.length == 0 && cupcakeSelectStep() < 2
                    }
                  >
                    <img
                      class={cupcakeSelectStep() > 1 ? styles.flipped : ''}
                      src="/images/arrow.svg"
                    />
                  </button>
                </div>

                <div class={`${styles.cart} ${styles.step}`}>
                  <h2>3. Review Cart</h2>
                  <div class={styles.cartGrid}>
                    <For each={order().boxes}>
                      {(box, i) => (
                        <>
                          <div class={styles.cupcakeBox}>
                            <CupcakeBox box={box} />
                          </div>
                          <div class={styles.divider} />
                          <div class={styles.boxInfo}>{`${box.type.quantity} ${
                            box.type.regular ? 'Regular' : 'Mini'
                          } - $${box.type.price}`}</div>
                          <div class={styles.divider} />
                          <div class={styles.flavors}>
                            {Object.entries(
                              box.cupcakes.reduce((flavorList, nextFlavor) => {
                                if (
                                  Object.keys(flavorList).includes(
                                    nextFlavor.name
                                  )
                                )
                                  flavorList[nextFlavor.name] += 1;
                                else flavorList[nextFlavor.name] = 1;
                                return flavorList;
                              }, {})
                            ).reduce(
                              (currString, flavor) =>
                                currString +
                                flavor[0] +
                                ' ×' +
                                flavor[1] +
                                `\n`,
                              ''
                            )}
                          </div>
                          <div class={styles.divider} />
                          <div class={styles.buttons}>
                            <button
                              class="button"
                              onClick={() => {
                                updateOrder({
                                  boxes: order().boxes.toSpliced(i(), 1),
                                });
                                if (order().boxes.length == 0) {
                                  setCupcakeSelectStep(0);
                                }
                              }}
                            >
                              Remove
                            </button>
                            <button
                              class="button"
                              onClick={() => {
                                if (activeBox() != undefined) {
                                  setActiveBoxEditBuffer(activeBox());
                                }
                                setActiveBox(box);
                                setCupcakeSelectStep(1);
                                updateOrder({
                                  boxes: order().boxes.toSpliced(i(), 1),
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button
                              class="button"
                              onClick={() => {
                                updateOrder({
                                  boxes: [
                                    ...order().boxes,
                                    structuredClone(box),
                                  ],
                                });
                              }}
                            >
                              Duplicate
                            </button>
                          </div>
                        </>
                      )}
                    </For>
                  </div>
                  <button
                    class={`button ${styles.addBox}`}
                    onClick={() => {
                      setCupcakeSelectStep(0);
                    }}
                  >
                    Add Another Box
                  </button>
                </div>
              </div>
              <div class={styles.nextPage}>
                <button
                  class={`${styles.back} button`}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(0);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  <img src="/images/arrow.svg" /> Back
                </button>
                <button
                  class={`${styles.next} button`}
                  disabled={order().boxes.length == 0}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(2);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  Next <img src="/images/arrow.svg" />
                </button>
              </div>
            </div>
            <div
              class={`${styles.pageBox} ${styles.extraDetails} ${
                state() < 2
                  ? styles.right
                  : state() >= 3
                  ? styles.left
                  : styles.active
              }`}
              id="state2"
            >
              <h2>Final details</h2>
              <div class={styles.detailsGrid}>
                <label>Name</label>
                <div class={styles.textInput}>
                  <input
                    type="text"
                    id="nameInput"
                    oninput={checkDetailInputs}
                    placeholder="(required)"
                    value={order().info.name}
                  />
                </div>
                <label>Email</label>
                <div class={styles.textInput}>
                  <input
                    type="email"
                    id="emailInput"
                    oninput={checkDetailInputs}
                    placeholder="(required)"
                    value={order().info.email}
                  />
                </div>
                <label>Phone</label>
                <div class={styles.textInput}>
                  <input
                    type="tel"
                    id="phoneInput"
                    oninput={checkDetailInputs}
                    value={order().info.phone}
                  />
                </div>
                <div class={styles.toAdd}>
                  <label>Anything else you wish to add?</label>
                  <textarea
                    id="toAddInput"
                    oninput={checkDetailInputs}
                    value={order().info.extra}
                  />
                </div>
                <div class={styles.newsletter}>
                  <label>
                    Do you want to recieve occasional
                    <br /> email updates about Tuxedo Cupcakes?
                  </label>

                  <input
                    type="checkbox"
                    id="newsletterInput"
                    oninput={checkDetailInputs}
                    checked={order().info.newsletter}
                  ></input>
                </div>
                <div class={styles.saveDetails}>
                  <label>Save my info for next time</label>

                  <input
                    type="checkbox"
                    id="saveInput"
                    oninput={checkDetailInputs}
                    checked={order().info.save}
                  ></input>
                </div>
              </div>
              <div class={styles.nextPage}>
                <button
                  class={`${styles.back} button`}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(1);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  <img src="/images/arrow.svg" /> Back
                </button>
                <button
                  class={`${styles.next} button`}
                  disabled={!extraDetailsValid()}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(3);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  Next <img src="/images/arrow.svg" />
                </button>
              </div>
            </div>
            <div
              class={`${styles.pageBox} ${styles.extraDetails} ${
                state() < 3
                  ? styles.right
                  : state() >= 4
                  ? styles.left
                  : styles.active
              }`}
              id="state3"
            >
              <h2>Review order</h2>
              <div class={styles.detailsGrid}>
                <label>Name</label>
                <div class={styles.textInput}>
                  <input
                    type="text"
                    id="nameInput"
                    oninput={checkDetailInputs}
                    placeholder="(required)"
                    value={order().info.name}
                  />
                </div>
                <label>Email</label>
                <div class={styles.textInput}>
                  <input
                    type="email"
                    id="emailInput"
                    oninput={checkDetailInputs}
                    placeholder="(required)"
                    value={order().info.email}
                  />
                </div>
                <label>Phone</label>
                <div class={styles.textInput}>
                  <input
                    type="tel"
                    id="phoneInput"
                    oninput={checkDetailInputs}
                    value={order().info.phone}
                  />
                </div>
                <div class={styles.toAdd}>
                  <label>Anything else you wish to add?</label>
                  <textarea
                    id="toAddInput"
                    oninput={checkDetailInputs}
                    value={order().info.extra}
                  />
                </div>
                <div class={styles.newsletter}>
                  <label>
                    Do you want to recieve occasional
                    <br /> email updates about Tuxedo Cupcakes?
                  </label>

                  <input
                    type="checkbox"
                    id="newsletterInput"
                    oninput={checkDetailInputs}
                    checked={order().info.newsletter}
                  ></input>
                </div>
                <div class={styles.saveDetails}>
                  <label>Save my info for next time</label>

                  <input
                    type="checkbox"
                    id="saveInput"
                    oninput={checkDetailInputs}
                    checked={order().info.save}
                  ></input>
                </div>
              </div>
              <div class={styles.nextPage}>
                <button
                  class={`${styles.back} button`}
                  onClick={async (e) => {
                    e.target.classList.add('submitted');
                    setState(2);
                    await sleep(1000);
                    e.target.classList.remove('submitted');
                  }}
                >
                  <img src="/images/arrow.svg" /> Back
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
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

function parsePhoneNumber(number: string) {
  let numberString = number.replace(
    /(\d{1,3})(\d{1,3})?(\d{1,4})?/,
    '($1) $2-$3'
  );
  if (numberString.charAt(numberString.length - 1) == '-') {
    numberString = numberString.split('-')[0];
  }
  if (numberString.charAt(numberString.length - 1) == ' ') {
    numberString = numberString.split(')')[0];
  }
  return numberString;
}
