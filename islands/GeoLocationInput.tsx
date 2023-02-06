import { createRef } from "preact";
import { useEffect, useState } from "preact/hooks";
import localities from "../services/localities.ts";
import { Locality } from "../types.d.ts";

function makeLocalTimestamp(utcTimestamp: number) {
  return utcTimestamp - new Date().getTimezoneOffset() * 60 * 1000;
}

interface GeoLocationInputProps {
  includeTime?: boolean;
}

export default function GeoLocationInput(props: GeoLocationInputProps) {
  const [searchResult, setSearchResult] = useState<Locality[]>([]);

  const latRef = createRef<HTMLInputElement>();
  const lngRef = createRef<HTMLInputElement>();
  const tmeRef = createRef<HTMLInputElement>();
  const lblRef = createRef<HTMLInputElement>();
  const btnRef = createRef<HTMLButtonElement>();

  function autoFill(locality?: Locality) {
    if (locality) {
      latRef.current!.valueAsNumber = locality.latitude;
      lngRef.current!.valueAsNumber = locality.longitude;
      tmeRef.current!.valueAsNumber = makeLocalTimestamp(Date.now());
      lblRef.current!.value = locality.label ?? "";
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

  let searchController: AbortController | null = null;

  async function updateProposedLocalities() {
    const searchText = lblRef.current!.value;
    searchController?.abort();
    searchController = new AbortController();
    if (searchText) {
      const current: Locality = {
        label: searchText,
        latitude: parseFloat(latRef.current!.value),
        longitude: parseFloat(lngRef.current!.value),
      };
      try {
        const result = await localities.find(searchText, searchController.signal);
        setSearchResult([current, ...result]);
      } catch (err) {
        if (err.name != "AbortError") throw err;
      }
    } else {
      setSearchResult([]);
    }
  }

  const inputs = [
    <label>
      Label
      <input
        ref={lblRef}
        type="text"
        name="label"
        onInput={updateProposedLocalities}
      />
    </label>,
    <label>
      Latitude
      <input ref={latRef} name="latitude" type="number" step="any" />
    </label>,
    <label>
      Longitude
      <input ref={lngRef} name="longitude" type="number" step="any" />
    </label>,
  ];

  useEffect(() => {
    updateProposedLocalities();
  }, []);

  if (props.includeTime) {
    inputs.push(
      <label>
        Date (UTC)
        <input ref={tmeRef} name="time" type="datetime-local" step="any" />
      </label>,
    );
  }

  const localitySelectors = searchResult.map((l, i) => {
    return (
      <label>
        <input
          type="radio"
          name="locality"
          checked={i == 0}
          onChange={() => autoFill(l)}
        />
        <span class="locality label">{l.label}</span>
        {l.description
          ? <span class="locality description">({l.description})</span>
          : <></>}
      </label>
    );
  });

  return (
    <>
      <fieldset>
        {inputs}
      </fieldset>
      <fieldset>
        <ul>
          {localitySelectors.map((s) => <li>{s}</li>)}
        </ul>
      </fieldset>
      <button ref={btnRef} type="button" onClick={() => autoFill()}>
        Locate
      </button>
    </>
  );
}
