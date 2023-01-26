import { GeoLocationDto } from "../types.d.ts";

interface GeoLocationDetailsProps {
  location: GeoLocationDto;
}

export default function GeoLocationDetails(props: GeoLocationDetailsProps) {
  const date = props.location.time ? new Date(props.location.time as unknown as string).toLocaleDateString() : "?";
  const lat = parseFloat(props.location.latitude as unknown as string).toFixed(3);
  const lng = parseFloat(props.location.longitude as unknown as string).toFixed(3);
  return (
    <table>
      <tr>
        <th colSpan={2}>{props.location.comment}</th>
      </tr>
      <tr>
        <th>Visited</th>
        <td>{date}</td>
      </tr>
      <tr>
        <th>Latitude</th>
        <td>{lat}</td>
      </tr>
      <tr>
        <th>Longitude</th>
        <td>{lng}</td>
      </tr>
    </table>
  );
}
