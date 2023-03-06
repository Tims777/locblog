import { Serialized } from "../helpers/serialization-helpers.ts";
import TableBuilder from "../helpers/table-helpers.tsx";
import { Place} from "../schema/place.ts";

interface GeoLocationDetailsProps {
  place: Serialized<Place>;
}

export default function PlaceDetails(props: GeoLocationDetailsProps) {
  return new TableBuilder(props.place.name)
    .appendMany(
      "Visited",
      props.place.visits.map((v) => new Date(v.date).toLocaleDateString()),
    )
    .append("Latitude", props.place.latitude.toFixed(3))
    .append("Longitude", props.place.longitude.toFixed(3))
    .complete();
}
