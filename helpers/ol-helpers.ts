import Feature from "ol/Feature";
import Coordinate from "ol/coordinate";
import * as extent from "ol/extent";

export function getCenter(features: Feature[]): Coordinate {
  const getExtent = (f: Feature) =>
    f.getGeometry()?.getExtent() ?? extent.createEmpty();
  const commonExtent = features.map(getExtent).reduce(
    extent.extend,
    extent.createEmpty(),
  );
  return extent.getCenter(commonExtent);
}
