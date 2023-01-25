import { GeoLocationDto } from "../types.d.ts";

interface GeoLocationDetailsProps {
  location: GeoLocationDto;
}

export default function GeoLocationDetails(props: GeoLocationDetailsProps) {
  console.log(props.location);
  return (
    <table>
      <tr>
        <th>Latitude</th>
        <td>{props.location.latitude}</td>
      </tr>
      <tr>
        <th>Longitude</th>
        <td>{props.location.longitude}</td>
      </tr>
    </table>
  );
}
