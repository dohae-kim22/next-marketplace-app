"use client";

import { useGoogleMaps } from "@/providers/MapsProvider";
import { Autocomplete } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";

interface LocationData {
  lat: number;
  lng: number;
  location?: string;
  street?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryCode?: string;
}

export default function LocationAutocomplete({
  onSelect,
  onChange,
  location,
  locationError,
}: {
  onSelect: (value: LocationData) => void;
  onChange?: () => void;
  location?: string;
  locationError?: string;
}) {
  const { isLoaded } = useGoogleMaps();

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState(locationError);

  useEffect(() => {
    setError(locationError);
  }, [locationError]);

  const parseAddressComponents = (
    components: google.maps.GeocoderAddressComponent[]
  ) => {
    let streetNumber = "";
    let route = "";
    let street = "";
    let city = "";
    let state = "";
    let postalCode = "";
    let countryCode = "";

    components.forEach((c) => {
      if (c.types.includes("street_number")) streetNumber = c.long_name;
      if (c.types.includes("route")) route = c.long_name;
      if (c.types.includes("locality")) city = c.long_name;
      if (c.types.includes("administrative_area_level_1")) state = c.long_name;
      if (c.types.includes("postal_code")) postalCode = c.long_name;
      if (c.types.includes("country")) countryCode = c.short_name;
    });

    if (streetNumber || route) street = `${streetNumber} ${route}`.trim();

    return { street, city, state, postalCode, countryCode };
  };

  const ensurePostalCode = async (
    lat: number,
    lng: number,
    parsed: LocationData
  ) => {
    if (parsed.postalCode) return parsed;

    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat, lng } });

    if (res.results?.[0]) {
      const postalComponent = res.results[0].address_components.find((c) =>
        c.types.includes("postal_code")
      );
      return {
        ...parsed,
        postalCode: postalComponent?.long_name || "",
      };
    }

    return parsed;
  };

  const onPlaceChanged = async () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) {
      setError("Please select a location from the list.");
      return;
    }

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || "";

    const { street, city, state, postalCode, countryCode } =
      parseAddressComponents(place.address_components || []);

    if (countryCode !== "FR") {
      setError("Only locations in France are allowed.");
      onSelect({ lat: NaN, lng: NaN });
      if (inputRef.current) inputRef.current.value = "";
      return;
    }

    let parsed: LocationData = {
      lat,
      lng,
      location: address,
      street,
      city,
      state,
      postalCode,
      countryCode,
    };

    parsed = await ensurePostalCode(lat, lng, parsed);

    setError("");
    onSelect(parsed);
  };

  const handleBlur = async () => {
    const value = inputRef.current?.value;
    if (!value) {
      onSelect({ lat: 0, lng: 0 });
      return;
    }
    if (!autocompleteRef.current?.getPlace()?.geometry) {
      setError("Please select a location from the list.");
    }
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-1 w-full">
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "fr" },
        }}
      >
        <input
          type="text"
          ref={inputRef}
          placeholder="Enter a location (e.g. Paris)"
          className="w-full border bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-orange-500 placeholder:text-neutral-400"
          defaultValue={location}
          onBlur={handleBlur}
          onChange={() => {
            if (error) setError("");
            onChange?.();
          }}
        />
      </Autocomplete>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
}
