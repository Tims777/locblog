import { geoOrthographic } from "d3";
import { GeoLocation, Rotation, Translation } from "../types.ts";

interface PinProps {
  location?: GeoLocation;
  rotation?: Rotation;
  translation?: Translation;
}

const PROP_DEFAULTS: PinProps = {
  location: [0, 0],
  rotation: [0, 0],
  translation: [0, 0],
};

export default function Pin(props: PinProps) {
  props = { ...PROP_DEFAULTS, ...props };
  const projected = geoOrthographic()
    .translate(props.translation!)
    .rotate(props.rotation!)(props.location!);
  if (projected) {
    const [x, y] = projected;
    return (
      <image
        href="/pin.svg"
        x={x}
        y={y}
        width="25"
        height="25"
        transform="translate(0 -25)"
      />
    );
  }
  return <></>;
}
