import { useId } from "preact/hooks";
import CirclePath from "./CirclePath.tsx";

const _2PI = 6.2831853;

export interface PostMarkProps {
  text: string;
  class?: string;
  radius?: number;
  rotate?: number;
}

export default function PostMark(props: PostMarkProps) {
  const r = props.radius ?? 100;
  const id = useId();
  const rOuter = r * .96;
  const rInner = r * .7;
  const strokeWidth = r * 0.02;
  const textOffset = r * 0.03;
  const textContent = [props.text, props.text, ""].join(" • ");
  const viewBox = [-r, -r, r * 2, r * 2].join(" ");
  return (
    <svg
      viewBox={viewBox}
      class={props.class}
      transform={`rotate(${props.rotate ?? 0})`}
    >
      <CirclePath r={rOuter} strokeWidth={strokeWidth} />
      <CirclePath r={rInner} strokeWidth={strokeWidth} id={id} />
      <text
        textLength={rInner * _2PI}
        lengthAdjust="spacingAndGlyphs"
        font-size={rOuter - rInner}
        dy={-textOffset}
      >
        <textPath href={`#${id}`}>
          {textContent.trim()}&nbsp;
        </textPath>
      </text>
    </svg>
  );
}
