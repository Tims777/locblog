import { createRef } from "preact";
import { useState } from "preact/hooks";
import localities from "../services/localities.ts";
import { Locality } from "../types.d.ts";

function makeLocalTimestamp(utcTimestamp: number) {
  return utcTimestamp - new Date().getTimezoneOffset() * 60 * 1000;
}

interface GeoLocationInputProps {
  includeTime?: boolean;
  includeLabel?: boolean;
}

export default function GeoLocationInput(props: GeoLocationInputProps) {
  const [proposedLocalities, setProposedLocalities] = useState<Locality[]>([]);

  const latRef = createRef<HTMLInputElement>();
  const lngRef = createRef<HTMLInputElement>();
  const tmeRef = createRef<HTMLInputElement>();
  const lblRef = createRef<HTMLInputElement>();
  const btnRef = createRef<HTMLButtonElement>();

  function autoFill(latitude?: number, longitude?: number, label?: string) {
    if (latitude && longitude && label) {
      latRef.current!.valueAsNumber = latitude;
      lngRef.current!.valueAsNumber = longitude;
      tmeRef.current!.valueAsNumber = makeLocalTimestamp(Date.now());
      lblRef.current!.value = label;
    } else if (navigator.geolocation) {
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

  async function updateProposedLocalities() {
    const name = lblRef.current!.value;
    const result = await localities.find(name);
    setProposedLocalities(result);
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

  if (props.includeLabel) {
    inputs.push(
      <label>
        Label
        <input
          ref={lblRef}
          type="text"
          name="label"
          onInput={updateProposedLocalities}
        />
      </label>,
    );
  }

  const localitySelectors = proposedLocalities.map((l) => (
    <button
      type="button"
      title={l.description}
      onClick={() => autoFill(l.latitude, l.longitude, l.label)}
    >
      {l.label}
    </button>
  ));

  return (
    <>
      <fieldset>
        {inputs}
      </fieldset>
      <fieldset>
        {localitySelectors}
      </fieldset>
      <button ref={btnRef} type="button" onClick={() => autoFill()}>
        Locate
      </button>
    </>
  );
}
