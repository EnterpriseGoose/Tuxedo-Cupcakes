import { createEffect, createSignal, For } from 'solid-js';
import styles from './CupcakeBox.module.scss';

export interface Flavor {
  id: string;
  name: string;
}

export interface BoxType {
  quantity: number;
  regular: boolean;
  price: number;
}

export interface Box {
  type: BoxType;
  cupcakes: Flavor[];
}

export const availableSizes: BoxType[] = [
  { quantity: 1, regular: true, price: 4 },
  { quantity: 2, regular: true, price: 8 },
  { quantity: 4, regular: true, price: 16 },
  { quantity: 6, regular: true, price: 20 },
  { quantity: 12, regular: true, price: 40 },
  { quantity: 6, regular: false, price: 10 },
  { quantity: 12, regular: false, price: 20 },
];

export default function CupcakeBox(props: {
  box: Box;
  editable?: boolean;
  brush?: string;
  scale?: number;
}) {
  if (props.scale == undefined) props.scale = 1;
  let [regularSize, setRegularSize] = createSignal(65 * props.scale);
  let [miniSize, setMiniSize] = createSignal(40 * props.scale);
  let [width, setWidth] = createSignal(20);
  let [height, setHeight] = createSignal(20);
  let [flavorArray2D, setFlavorArray2D] = createSignal([]);
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

  return (
    <div>
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
                      cx={`${
                        10 * props.scale +
                        cupcakeSize() / 2 +
                        cupcakeSize() * j()
                      }`}
                      cy={`${
                        10 * props.scale +
                        cupcakeSize() / 2 +
                        cupcakeSize() * i()
                      }`}
                      fill="#eeeeee"
                    />
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
