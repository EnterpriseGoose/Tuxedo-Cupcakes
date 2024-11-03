export default function Cupcake(props: {
  flavor: Flavor;
  size: number;
  scale: number;
  x?: number;
  y?: number;
  onBrush?: () => void;
}) {
  let scaledSize = props.size * props.scale;

  return (
    <svg
      width={scaledSize}
      height={scaledSize}
      viewBox={`0 0 ${scaledSize} ${scaledSize}`}
      x={props.x || ''}
      y={props.y || ''}
      onMouseDown={props.onBrush}
      onMouseEnter={(e) => {
        if (e.buttons % 2 == 1) {
          props.onBrush();
        }
      }}
    >
      <circle
        r={scaledSize / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.cake}
      />
      <circle
        r={(scaledSize * 0.75) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={(scaledSize * 0.7) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
      <circle
        r={(scaledSize * 0.5) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={(scaledSize * 0.45) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
      <circle
        r={(scaledSize * 0.25) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting_outline}
      />
      <circle
        r={(scaledSize * 0.2) / 2 - 1 * props.scale}
        cx={scaledSize / 2}
        cy={scaledSize / 2}
        fill={props.flavor.frosting}
      />
    </svg>
  );
}
