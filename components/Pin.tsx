import { geoOrthographic } from "d3";
import { GeoLocation, GeoRotation } from "../types.ts";

interface PinProps {
  location: GeoLocation;
  rotation: GeoRotation;
}

export default function Pin(props: PinProps) {
    const projected = geoOrthographic().rotate(props.rotation)(props.location);
    if (projected) {
        const [x, y] = projected;
        return <image href="/pin.svg" x={x} y={y} width="25" height="25" transform="translate(0 -25)" />
    }
    return <></>
}