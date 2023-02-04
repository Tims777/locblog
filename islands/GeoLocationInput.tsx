import { createRef } from "preact";
import localities from "../services/localities.ts";

function makeLocalTimestamp(utcTimestamp: number) {
  return utcTimestamp - new Date().getTimezoneOffset() * 60 * 1000;
}

interface GeoLocationInputProps {
  includeTime?: boolean;
  includeName?: boolean;
}

export default function GeoLocationInput(props: GeoLocationInputProps) {
  const latRef = createRef<HTMLInputElement>();
  const lngRef = createRef<HTMLInputElement>();
  const tmeRef = createRef<HTMLInputElement>();
  const nmeRef = createRef<HTMLInputElement>();
  const btnRef = createRef<HTMLButtonElement>();

  function autoFill() {
    if (navigator.geolocation) {
      btnRef.current!.disabled = true;
      navigator.geolocation.getCurrentPosition((location) => {
        latRef.current!.valueAsNumber = location.coords.latitude;
        lngRef.current!.valueAsNumber = location.coords.longitude;
        tmeRef.current!.valueAsNumber = makeLocalTimestamp(location.timestamp);
        btnRef.current!.disabled = false;
      });
    } else {
      alert("GeoLocation is not available on your device, sorry!");
    }
  }

  async function updatePredefinedPlacesList() {    
    const name = nmeRef.current!.value;
    const result = await localities.find(name);
    for (const loc of result) {
      console.log(loc);
    }
  }

  const inputs = [
    <label>
      Latitude
      <input ref={latRef} name="latitude" type="number" step="any" />
    </label>,
    <label>
      Longitude
      <input ref={lngRef} name="longitude" type="number" step="any" />
    </label>,
  ];

  if (props.includeTime) {
    inputs.push(
      <label>
        Date (UTC)
        <input ref={tmeRef} name="time" type="datetime-local" step="any" />
      </label>,
    );
  }

  if (props.includeName) {
    inputs.push(
      <label>
        Description
        <input ref={nmeRef} type="text" name="description" onInput={updatePredefinedPlacesList} />
      </label>,
    );
  }

  return (
    <>
      {inputs}
      <button ref={btnRef} type="button" onClick={autoFill}>
        Locate
      </button>
    </>
  );
}
