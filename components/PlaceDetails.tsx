import { type MaybeSerialized } from "../helpers/serialization-helpers.ts";
import TableBuilder from "../helpers/table-helpers.tsx";
import { Place } from "../schema/place.ts";

interface PlaceDetailsProps {
  place: MaybeSerialized<Place>;
}

export default function PlaceDetails(props: PlaceDetailsProps) {
  const tableTitle = props.place.resource
    ? <a href={props.place.resource}>{props.place.name}</a>
    : props.place.name;

  return new TableBuilder(tableTitle)
    .appendMany(
      "Visited",
      props.place.visits.map((v) => new Date(v.date).toLocaleDateString()),
    )
    .append("Latitude", props.place.latitude.toFixed(3))
    .append("Longitude", props.place.longitude.toFixed(3))
    .complete();
}
