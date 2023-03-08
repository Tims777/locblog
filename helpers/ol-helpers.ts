import type Feature from "ol/Feature";
import * as extent from "ol/extent";

export function getCenter(features: Feature[]) {
  const getExtent = (f: Feature) =>
    f.getGeometry()?.getExtent() ?? extent.createEmpty();
  const commonExtent = features.map(getExtent).reduce(
    extent.extend,
    extent.createEmpty(),
  );
  return extent.getCenter(commonExtent);
}
