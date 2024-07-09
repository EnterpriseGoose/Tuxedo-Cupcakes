import { For } from 'solid-js';
import styles from './CupcakeBox.module.scss';

export interface Flavor {
  id: string;
  name: string;
}

export interface BoxType {
  quantity: number;
  regular: boolean;
}

export interface Box {
  type: BoxType;
  cupcakes: Flavor[];
}

export const availableSizes: BoxType[] = [
  { quantity: 1, regular: true },
  { quantity: 2, regular: true },
  { quantity: 4, regular: true },
  { quantity: 6, regular: true },
  { quantity: 12, regular: true },
  { quantity: 6, regular: false },
  { quantity: 12, regular: false },
];

const regularSize = 65;
const miniSize = 40;

export default function CupcakeBox(props: {
  box: Box;
  editable?: boolean;
  brush?: string;
  scale?: number;
}) {
  let width = 20;
  let height = 20;
  let regular = props.box.type.regular;
  let cupcakeSize = regular ? regularSize : miniSize;

  width += Math.ceil(Math.sqrt(props.box.type.quantity)) * cupcakeSize;
  height += Math.floor(Math.sqrt(props.box.type.quantity)) * cupcakeSize;

  let flavorArray2D = transformBox(props.box);

  return (
    <div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <rect width="100%" height="100%" fill="#cccccc" />
        <rect
          width={width - 20}
          height={height - 20}
          fill="white"
          x={10}
          y={10}
        />
        <For each={flavorArray2D}>
          {(row, i) => (
            <>
              <For each={row}>
                {(cupcake, j) => (
                  <>
                    <circle
                      r={cupcakeSize / 2 - 5}
                      cx={`${10 + cupcakeSize / 2 + cupcakeSize * j()}`}
                      cy={`${10 + cupcakeSize / 2 + cupcakeSize * i()}`}
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
