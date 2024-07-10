import { JSX } from 'solid-js';
import { Flavor } from '../CupcakeBox';

export default function Cupcake(props: {
  flavor: Flavor;
  size: number;
  scale: number;
  x?: number;
  y?: number;
  onClick?: JSX.EventHandlerUnion<SVGSVGElement, MouseEvent>;
}) {
  let scaledSize = props.size * props.scale;

  return (
    <svg
      width={scaledSize}
      height={scaledSize}
      viewBox={`0 0 ${scaledSize} ${scaledSize}`}
      x={props.x || ''}
      y={props.y || ''}
      onClick={props.onClick}
    >
      <circle
        r={scaledSize / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.cake}
      />
      <circle
        r={((scaledSize * 0.5) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={((scaledSize * 0.45) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
      <circle
        r={((scaledSize * 0.35) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={((scaledSize * 0.3) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
      <circle
        r={((scaledSize * 0.15) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={((scaledSize * 0.1) / 2) * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
    </svg>
  );
}
