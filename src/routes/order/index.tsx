import Layout from '~/components/Layout';
import styles from './index.module.scss';
import { For, Match, Show, Switch, createSignal, onMount } from 'solid-js';
import CupcakeBox, { availableSizes } from '~/components/CupcakeBox';
import type { Flavor, Box, BoxType } from '~/components/CupcakeBox';

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

interface Market {
  week: Date;
  times: string[];
  names: string[];
  flavors: Flavor[];
}

interface Order {
  market: Market;
  time: string;
  name: string;
  boxes: Box[];
  info: {
    name: string;
    email: string;
    phone: string;
    extra: string;
    newsletter: boolean;
    save: boolean;
    discount: boolean;
  };
}

const FLAVORS: { [id: string]: Flavor } = {
  VANILLA_VANILLA: { id: 'VANILLA_VANILLA', name: 'Vanilla Vanilla' },
  VANILLA_CHOCOLATE: { id: 'VANILLA_CHOCOLATE', name: 'Vanilla Chocolate' },
  CHOCOLATE_VANILLA: { id: 'CHOCOLATE_VANILLA', name: 'Chocolate Vanilla' },
  CHOCOLATE_CHOCOLATE: {
    id: 'CHOCOLATE_CHOCOLATE',
    name: 'Chocolate Chocolate',
  },
  STRAWBERRY: {
    id: 'STRAWBERRY',
    name: 'Strawberry',
  },
  CHOCOLATE_STRAWBERRY: {
    id: 'CHOCOLATE_STRAWBERRY',
    name: 'Chocolate Strawberry',
  },
  MOCHA: { id: 'MOCHA', name: 'Mocha' },
  COCONUT_PASSION_FRUIT: {
    id: 'COCONUT_PASSION_FRUIT',
    name: 'Coconut Passion Fruit',
  },
  SALTED_CARAMEL_CASHEW: {
    id: 'SALTED_CARAMEL_CASHEW',
    name: 'Salted Caramel Cashew',
  },
  CHOCOLATE_RASPBERRY: {
    id: 'CHOCOLATE_RASPBERRY',
    name: 'Chocolate Raspberry',
  },
  CHOCOLATE_CHERRY: {
    id: 'CHOCOLATE_CHERRY',
    name: 'Chocolate Cherry',
  },
  LEMON_PISTACHIO: {
    id: 'LEMON_PISTACHIO',
    name: 'Lemon Pistachio',
  },
  COCONUT_RASPBERRY: {
    id: 'COCONUT_RASPBERRY',
    name: 'Coconut Raspberry',
  },
};

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
      FLAVORS.SALTED_CARAMEL_CASHEW,
    ],
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
  },
];

let activeMarkets: Market[] = [];

export default function Order() {
  let [pageUp, setPageUp] = createSignal(true);
  let [state, setState] = createSignal(0);
  let [marketSelect, setMarketSelect] = createSignal(0);
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
        discount: false,
      },
    },
    { equals: false }
  );
  const updateOrder = (partialOrder: DeepPartial<Order>) => {
    setOrder(Object.assign(order(), partialOrder));
  };
  let [activeBox, setActiveBox] = createSignal<Box>();

  activeMarkets = [];
  if (activeMarkets.length == 0) {
    for (let market of MARKETS) {
      if (activeMarkets.length >= 3) continue;
      if (market.week.getTime() + 345600000 > Date.now()) {
        activeMarkets.push(market);
      }
    }
  }

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
            >
              Place order now
            </button>
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
              <h2>Choose Your Pickup Market</h2>
              <div
                class={styles.marketGrid}
                style={{ left: `calc(15vw - ${marketSelect() * 82.5}vw)` }}
              >
                <For each={activeMarkets}>
                  {(market, i) => (
                    <>
                      <div class={styles.marketGroup}>
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
              <div class={styles.divider}>
                <div class={styles.boxChoice}>
                  <h2>1. Select Box</h2>
                  <div class={styles.boxGrid}>
                    <For each={availableSizes}>
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
                            setActiveBox({ type: boxSize, cupcakes: [] });
                            console.log({ type: boxSize, cupcakes: [] });
                            console.log(activeBox());
                          }}
                        >
                          <CupcakeBox
                            box={{
                              type: boxSize,
                              cupcakes: [],
                            }}
                          />
                        </div>
                      )}
                    </For>
                  </div>
                </div>
                <div class={styles.flavorChoice}>
                  <h2>2. Select Flavors</h2>
                  <div class={styles.boxInfo}>
                    <Show when={activeBox() != undefined}>
                      <p>{`${activeBox().type.quantity} ${
                        activeBox().type.regular ? 'Regular' : 'Mini'
                      } - \$${activeBox().type.price}`}</p>
                      <CupcakeBox
                        box={activeBox()}
                        editable={true}
                        scale={1.5}
                        brush=""
                      />
                    </Show>
                  </div>
                  <div class={styles.nextPage}>
                    <button
                      class={`${styles.back} button`}
                      disabled={order().time == ''}
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
                      disabled={order().time == ''}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
