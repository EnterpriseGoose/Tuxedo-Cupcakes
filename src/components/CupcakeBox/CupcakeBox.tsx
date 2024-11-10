import { createEffect, createSignal, For, Setter, Show } from 'solid-js';
import styles from './CupcakeBox.module.scss';
import Cupcake from '../Cupcake';

export const AVAILABLE_SIZES: BoxType[] = [
  { quantity: 1, regular: true, price: 4 },
  { quantity: 2, regular: true, price: 8 },
  { quantity: 4, regular: true, price: 16 },
  { quantity: 6, regular: true, price: 20 },
  { quantity: 12, regular: true, price: 40 },
  { quantity: 6, regular: false, price: 10 },
  { quantity: 12, regular: false, price: 20 },
];

const CHOCOLATE_CAKE = '#512D1E';
const VANILLA_CAKE = '#F8ECD4';
const LEMON_CAKE = '#FFDFA1';
const CINNAMON_CAKE = '#E3BB8B';

export const FLAVORS /*: { [id: string]: Flavor }*/ = {
  GAP: {
    id: 'GAP',
    tag: '',
    name: '',
    cake: VANILLA_CAKE,
    frosting: '#FFFFFF',
    frosting_outline: '#FFFFFF',
  },
  VANILLA_VANILLA: {
    id: 'VANILLA_VANILLA',
    tag: 'V_V',
    name: 'Vanilla Vanilla',
    cake: VANILLA_CAKE,
    frosting: '#F0ECE3',
    frosting_outline: '#EEE9DF',
  },
  VANILLA_CHOCOLATE: {
    id: 'VANILLA_CHOCOLATE',
    tag: 'V_C',
    name: 'Vanilla Chocolate',
    cake: VANILLA_CAKE,
    frosting: '#7E5E50',
    frosting_outline: '#6F5144',
  },
  CHOCOLATE_VANILLA: {
    id: 'CHOCOLATE_VANILLA',
    tag: 'C_V',
    name: 'Chocolate Vanilla',
    cake: CHOCOLATE_CAKE,
    frosting: '#F0ECE3',
    frosting_outline: '#EEE9DF',
  },
  CHOCOLATE_CHOCOLATE: {
    id: 'CHOCOLATE_CHOCOLATE',
    tag: 'C_C',
    name: 'Chocolate Chocolate',
    cake: CHOCOLATE_CAKE,
    frosting: '#7E5E50',
    frosting_outline: '#6F5144',
  },
  STRAWBERRY: {
    id: 'STRAWBERRY',
    tag: 'V_S',
    name: 'Strawberry',
    cake: VANILLA_CAKE,
    frosting: '#ECBDC2',
    frosting_outline: '#E9B7BD',
  },
  CHOCOLATE_STRAWBERRY: {
    id: 'CHOCOLATE_STRAWBERRY',
    tag: 'C_S',
    name: 'Chocolate Strawberry',
    cake: CHOCOLATE_CAKE,
    frosting: '#ECBDC2',
    frosting_outline: '#E9B7BD',
  },
  MOCHA: {
    id: 'MOCHA',
    tag: 'C_MO',
    name: 'Mocha',
    cake: CHOCOLATE_CAKE,
    frosting: '#A67C6A',
    frosting_outline: '#9E7766',
  },
  COCONUT_PASSION_FRUIT: {
    id: 'COCONUT_PASSION_FRUIT',
    tag: 'CO_PF',
    name: 'Coconut Passion Fruit',
    cake: VANILLA_CAKE,
    frosting: '#FEE9C0',
    frosting_outline: '#F8DEAC',
  },
  SALTED_CARAMEL_CASHEW: {
    id: 'SALTED_CARAMEL_CASHEW',
    tag: 'V_SCC',
    name: 'Salted Caramel Cashew',
    cake: VANILLA_CAKE,
    frosting: '#E9C9A4',
    frosting_outline: '#D8BC9B',
  },
  CHOCOLATE_RASPBERRY: {
    id: 'CHOCOLATE_RASPBERRY',
    tag: 'C_R',
    name: 'Chocolate Raspberry',
    cake: CHOCOLATE_CAKE,
    frosting: '#DF779C',
    frosting_outline: '#D36A8F',
  },
  CHOCOLATE_CHERRY: {
    id: 'CHOCOLATE_CHERRY',
    tag: 'C_CH',
    name: 'Chocolate Cherry',
    cake: CHOCOLATE_CAKE,
    frosting: '#E0A5DE',
    frosting_outline: '#CC96CA',
  },
  LEMON_PISTACHIO: {
    id: 'LEMON_PISTACHIO',
    tag: 'L_P',
    name: 'Lemon Pistachio',
    cake: LEMON_CAKE,
    frosting: '#D5F5BB',
    frosting_outline: '#C9ECAD',
  },
  COCONUT_RASPBERRY: {
    id: 'COCONUT_RASPBERRY',
    tag: 'CO_R',
    name: 'Coconut Raspberry',
    cake: VANILLA_CAKE,
    frosting: '#DF779C',
    frosting_outline: '#D36A8F',
  },
  CHOCOLATE_PEANUT_BUTTER: {
    id: 'CHOCOLATE_PEANUT_BUTTER',
    tag: 'C_PB',
    name: 'Chocolate Peanut Butter',
    cake: CHOCOLATE_CAKE,
    frosting: '#F5DCBE',
    frosting_outline: '#EED3B3',
  },
  CINNAMON_PEACH: {
    id: 'CINNAMON_PEACH',
    tag: 'CN_PE',
    name: 'Cinnamon Peach',
    cake: CINNAMON_CAKE,
    frosting: '#F1C59D',
    frosting_outline: '#EEB682',
  },
  CHOCOLATE_BLACK_SESAME: {
    id: 'CHOCOLATE_BLACK_SESAME',
    tag: 'C_BS',
    name: 'Chocolate Black Sesame',
    cake: CHOCOLATE_CAKE,
    frosting: '#5A5550',
    frosting_outline: '#393632',
  },
  RED_BEAN: {
    id: 'RED_BEAN',
    tag: 'V_RB',
    name: 'Red Bean',
    cake: VANILLA_CAKE,
    frosting: '#DBBBB1',
    frosting_outline: '#C1A096',
  },
  MASALA_CHAI: {
    id: 'MASALA_CHAI',
    tag: 'V_MC',
    name: 'Masala Chai',
    cake: VANILLA_CAKE,
    frosting: '#F5E4B7',
    frosting_outline: '#EADBB4',
  },
  CHOCOLATE_CARAMEL: {
    id: 'CHOCOLATE_CARAMEL',
    tag: 'C_CA',
    name: 'Chocolate Caramel',
    cake: CHOCOLATE_CAKE,
    frosting: '#E9C9A4',
    frosting_outline: '#D8BC9B',
  },
  CHOCOLATE_MATCHA: {
    id: 'CHOCOLATE_MATCHA',
    tag: 'C_MA',
    name: 'Chocolate Matcha',
    cake: CHOCOLATE_CAKE,
    frosting: '#C0D8B5',
    frosting_outline: '#A5C198',
  },
  PUMPKIN_SPICE: {
    id: 'PUMPKIN_SPICE',
    tag: 'P_S',
    name: 'Pumpkin Spice',
    cake: CINNAMON_CAKE,
    frosting: '#F8DECB',
    frosting_outline: '#EDCAB1',
  },
  APPLE_PIE: {
    id: 'APPLE_PIE',
    tag: 'V_AP',
    name: 'Apple Pie',
    cake: CINNAMON_CAKE,
    frosting: '#E9CAB4',
    frosting_outline: '#DCB99F',
  },
  CHOCOLATE_PEPPERMINT: {
    id: 'CHOCOLATE_PEPPERMINT',
    tag: 'C_PP',
    name: 'Chocolate Peppermint',
    cake: CHOCOLATE_CAKE,
    frosting: '#FFA5AE',
    frosting_outline: '#FF9AA4',
  },
  MEXICAN_HOT_CHOCOLATE: {
    id: 'MEXICAN_HOT_CHOCOLATE',
    tag: 'C_MHT',
    name: 'Mexican Hot Chocolate',
    cake: CHOCOLATE_CAKE,
    frosting: '#775444',
    frosting_outline: '#6F4A3A',
  },
  GINGERBREAD: {
    id: 'GINGERBREAD',
    tag: 'GB_D',
    name: 'Gingerbread',
    cake: CHOCOLATE_CAKE,
    frosting: '#F4E8DF',
    frosting_outline: '#F0E2D8',
  },
  BROWN_SUGAR_SWEET_POTATO: {
    id: 'BROWN_SUGAR_SWEET_POTATO',
    tag: 'BS_SP',
    name: 'Brown Sugar Sweet Potato',
    cake: CINNAMON_CAKE,
    frosting: '#DDAF8D',
    frosting_outline: '#D1A380',
  },
};

export default function CupcakeBox(props: {
  box: Box;
  editable?: boolean;
  brush?: Flavor;
  scale?: number;
  setActiveBox?: Setter<Box>;
  tooltip?: boolean;
  detailedTooltip?: boolean;
}) {
  props.scale ||= 1;
  let [regularSize, setRegularSize] = createSignal(65 * props.scale);
  let [miniSize, setMiniSize] = createSignal(40 * props.scale);
  let [width, setWidth] = createSignal(20);
  let [height, setHeight] = createSignal(20);
  let [flavorArray2D, setFlavorArray2D] = createSignal<Flavor[][]>([]);
  let [cupcakeSize, setCupcakeSize] = createSignal(0);
  let [regular, setRegular] = createSignal(true);

  createEffect(() => {
    let width = 20 * props.scale;
    let height = 20 * props.scale;
    setRegular(props.box.type.regular);
    setCupcakeSize(regular() ? regularSize() : miniSize());

    width += Math.ceil(Math.sqrt(props.box.type.quantity)) * cupcakeSize();
    height += Math.floor(Math.sqrt(props.box.type.quantity)) * cupcakeSize();
    setWidth(width);
    setHeight(height);

    setFlavorArray2D(transformBox(props.box));
  });

  const brushFlavor = (x: number, y: number) => {
    if (props.editable && props.brush && props.setActiveBox != undefined) {
      setFlavorArray2D((flavorArray) => {
        flavorArray[x][y] = props.brush;
        return flavorArray;
      });
      props.setActiveBox({
        type: props.box.type,
        cupcakes: flavorArray2D().flat(),
      });
    }
  };

  return (
    <div class="tooltip">
      <Show when={props.tooltip}>
        <span class="tooltip-text">{`${props.box.type.quantity} ${
          props.box.type.regular ? 'Regular' : 'Mini'
        } - \$${props.box.type.price}`}</span>
      </Show>
      <Show when={props.detailedTooltip}>
        <span class="tooltip-text">
          {`${props.box.type.quantity} ${
            props.box.type.regular ? 'Regular' : 'Mini'
          } - \$${props.box.type.price}`}
          <br />
          {Object.entries(
            props.box.cupcakes.reduce((flavorList, nextFlavor) => {
              if (Object.keys(flavorList).includes(nextFlavor.name))
                flavorList[nextFlavor.name] += 1;
              else flavorList[nextFlavor.name] = 1;
              return flavorList;
            }, {})
          ).reduce((currString, flavor) => {
            console.log(currString);
            const desc = document.createElement('b');
            desc.textContent = flavor[0] + ' ×' + flavor[1];
            (currString as Element).appendChild(desc);
            (currString as Element).appendChild(document.createElement('br'));
            return currString;
          }, <span></span>)}
        </span>
      </Show>
      <svg
        width={width()}
        height={height()}
        viewBox={`0 0 ${width()} ${height()}`}
      >
        <rect width="100%" height="100%" fill="#cccccc" />
        <rect
          width={width() - 20 * props.scale}
          height={height() - 20 * props.scale}
          fill="white"
          x={10 * props.scale}
          y={10 * props.scale}
        />
        <For each={flavorArray2D()}>
          {(row, i) => (
            <>
              <For each={row}>
                {(cupcake, j) => (
                  <>
                    <circle
                      r={cupcakeSize() / 2 - 5 * props.scale}
                      cx={
                        10 * props.scale +
                        cupcakeSize() / 2 +
                        cupcakeSize() * j()
                      }
                      cy={
                        10 * props.scale +
                        cupcakeSize() / 2 +
                        cupcakeSize() * i()
                      }
                      fill="#eeeeee"
                      onMouseEnter={(e) => {
                        if (e.buttons % 2 == 1) {
                          brushFlavor(i(), j());
                        }
                      }}
                      onMouseDown={() => {
                        brushFlavor(i(), j());
                      }}
                    />
                    <Show when={cupcake}>
                      <Cupcake
                        flavor={cupcake}
                        scale={props.scale}
                        size={cupcakeSize() / props.scale}
                        x={10 * props.scale + cupcakeSize() * j()}
                        y={10 * props.scale + cupcakeSize() * i()}
                        onBrush={() => {
                          brushFlavor(i(), j());
                        }}
                      />
                    </Show>
                  </>
                )}
              </For>
            </>
          )}
        </For>
      </svg>
    </div>
  );
}

function transformBox(box: Box): Flavor[][] {
  let rows = Math.floor(Math.sqrt(box.type.quantity));
  let cols = Math.ceil(Math.sqrt(box.type.quantity));
  let output = [];
  for (let i = 0; i < rows; i++) {
    output.push([]);
    for (let j = 0; j < cols; j++) {
      output[i].push(box.cupcakes[i * cols + j]);
    }
  }

  return output;
}

export function encodeBox(box: Box): { t: string; f: string } {
  let outBox: { t: string; f: string } = {
    t:
      (box.type.regular ? 'R' : 'M') +
      '-' +
      box.type.quantity +
      '-' +
      box.type.price,
    f: '',
  };
  let flavors = [];
  box.cupcakes.forEach((flavor) => {
    flavors.push(flavor.tag);
  });
  outBox.f = flavors.join('-');
  return outBox;
}

export function decodeBox(box: { t: string; f: string }): Box {
  let outBox: Box = {
    type: {
      regular: box.t.split('-')[0] == 'R',
      quantity: parseInt(box.t.split('-')[1]),
      price: parseInt(box.t.split('-')[2]),
    },
    cupcakes: [],
  };
  box.f.split('-').forEach((flavorTag) => {
    outBox.cupcakes.push(
      FLAVORS[Object.values(FLAVORS).find(({ tag }) => tag == flavorTag).id]
    );
  });
  return outBox;
}
