import { useState } from "preact/hooks";
import { createStepper } from "../helpers/preact-helpers.ts";
import { type MaybeSerialized } from "../helpers/serialization-helpers.ts";
import TableBuilder from "../helpers/table-helpers.tsx";
import { type PlaceDetails } from "../schema/place.ts";

interface PlaceDetailsProps {
  places: MaybeSerialized<PlaceDetails>[];
}

function byLastVisitDate(a: MaybeSerialized<PlaceDetails>, b: MaybeSerialized<PlaceDetails>) {
  return new Date(a.last_visit ?? 0).getTime() - new Date(b.last_visit ?? 0).getTime();
}

export default function PlaceDetails(props: PlaceDetailsProps) {
  props.places.sort(byLastVisitDate);
  const placeCount = props.places.length;

  const [index, setIndex] = useState<number>(0);
  const [prev, next] = createStepper(setIndex, 1, placeCount);
  const place = props.places[index];

  let tableTitle = place.resource
    ? <a href={place.resource}>{place.name}</a>
    : place.name;

  if (placeCount > 1) {
    tableTitle = (
      <>
        <button onClick={prev}>&larr;</button>
        {tableTitle}
        <button onClick={next}>&rarr;</button>
      </>
    );
  }

  return new TableBuilder(tableTitle)
    .appendMany(
      "Visited",
      place.visits.map((v) => new Date(v.date).toLocaleDateString()),
    )
    .append("Latitude", place.latitude.toFixed(3))
    .append("Longitude", place.longitude.toFixed(3))
    .complete();
}
