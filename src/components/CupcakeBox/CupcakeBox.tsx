import { createEffect, createSignal, For, Setter, Show } from 'solid-js';
import styles from './CupcakeBox.module.scss';
import Cupcake from '../Cupcake/Cupcake';

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

export const FLAVORS: { [id: string]: Flavor } = {
  VANILLA_VANILLA: {
    id: 'VANILLA_VANILLA',
    name: 'Vanilla Vanilla',
    cake: VANILLA_CAKE,
    frosting: '#F0ECE3',
    frosting_outline: '#EEE9DF',
  },
  VANILLA_CHOCOLATE: {
    id: 'VANILLA_CHOCOLATE',
    name: 'Vanilla Chocolate',
    cake: VANILLA_CAKE,
    frosting: '#7E5E50',
    frosting_outline: '#6F5144',
  },
  CHOCOLATE_VANILLA: {
    id: 'CHOCOLATE_VANILLA',
    name: 'Chocolate Vanilla',
    cake: CHOCOLATE_CAKE,
    frosting: '#F0ECE3',
    frosting_outline: '#EEE9DF',
  },
  CHOCOLATE_CHOCOLATE: {
    id: 'CHOCOLATE_CHOCOLATE',
    name: 'Chocolate Chocolate',
    cake: CHOCOLATE_CAKE,
    frosting: '#7E5E50',
    frosting_outline: '#6F5144',
  },
  STRAWBERRY: {
    id: 'STRAWBERRY',
    name: 'Strawberry',
    cake: VANILLA_CAKE,
    frosting: '#ECBDC2',
    frosting_outline: '#E9B7BD',
  },
  CHOCOLATE_STRAWBERRY: {
    id: 'CHOCOLATE_STRAWBERRY',
    name: 'Chocolate Strawberry',
    cake: CHOCOLATE_CAKE,
    frosting: '#ECBDC2',
    frosting_outline: '#E9B7BD',
  },
  MOCHA: {
    id: 'MOCHA',
    name: 'Mocha',
    cake: CHOCOLATE_CAKE,
    frosting: '#A67C6A',
    frosting_outline: '#9E7766',
  },
  COCONUT_PASSION_FRUIT: {
    id: 'COCONUT_PASSION_FRUIT',
    name: 'Coconut Passion Fruit',
    cake: VANILLA_CAKE,
    frosting: '#FEE9C0',
    frosting_outline: '#F8DEAC',
  },
  SALTED_CARAMEL_CASHEW: {
    id: 'SALTED_CARAMEL_CASHEW',
    name: 'Salted Caramel Cashew',
    cake: VANILLA_CAKE,
    frosting: '#E9C9A4',
    frosting_outline: '#D8BC9B',
  },
  CHOCOLATE_RASPBERRY: {
    id: 'CHOCOLATE_RASPBERRY',
    name: 'Chocolate Raspberry',
    cake: CHOCOLATE_CAKE,
    frosting: '#DF779C',
    frosting_outline: '#D36A8F',
  },
  CHOCOLATE_CHERRY: {
    id: 'CHOCOLATE_CHERRY',
    name: 'Chocolate Cherry',
    cake: CHOCOLATE_CAKE,
    frosting: '#E0A5DE',
    frosting_outline: '#CC96CA',
  },
  LEMON_PISTACHIO: {
    id: 'LEMON_PISTACHIO',
    name: 'Lemon Pistachio',
    cake: LEMON_CAKE,
    frosting: '#FEE9C0',
    frosting_outline: '#BEE0A2',
  },
  COCONUT_RASPBERRY: {
    id: 'COCONUT_RASPBERRY',
    name: 'Coconut Raspberry',
    cake: VANILLA_CAKE,
    frosting: '#DF779C',
    frosting_outline: '#D36A8F',
  },
};

export default function CupcakeBox(props: {
  box: Box;
  editable?: boolean;
  brush?: Flavor;
  scale?: number;
  setActiveBox?: Setter<Box>;
  tooltip?: boolean;
}) {
  if (props.scale == undefined) props.scale = 1;
  let [regularSize, setRegularSize] = createSignal(65 * props.scale);
  let [miniSize, setMiniSize] = createSignal(40 * props.scale);
  let [width, setWidth] = createSignal(20);
  let [height, setHeight] = createSignal(20);
  let [flavorArray2D, setFlavorArray2D] = createSignal<Flavor[][]>([]);
  let [cupcakeSize, setCupcakeSize] = createSignal(0);
  let [regular, setRegular] = createSignal(true);

  createEffect(() => {
    console.log('reloading box');
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
                      onClick={() => {
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
                        onClick={() => {
                          brushFlavor(i(), j());
                          console.dir(flavorArray2D());
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
