export interface CirclePathProps {
  r?: number;
  id?: string;
  strokeWidth?: number;
}

export default function CirclePath(props: CirclePathProps) {
  const r = props.r ?? 1;
  return (
    <path
      id={props.id}
      d={`M ${-r} 0 A ${r} ${r} 0 0 1 ${r} 0 A ${r} ${r} 0 0 1 ${-r} 0`}
      stroke="black"
      fill="transparent"
      stroke-width={props.strokeWidth ?? 1}
    />
  );
}
