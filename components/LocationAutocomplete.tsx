"use client";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useRef } from "react";

export default function LocationAutocomplete({
  onSelect,
  location,
}: {
  onSelect: (value: { address: string; lat: number; lng: number }) => void;
  location?: string;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.formatted_address) return;

    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();
    const address = place.formatted_address;
    if (lat && lng && address) {
      onSelect({ lat, lng, address });
    }
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <Autocomplete
      onLoad={(ref) => (autocompleteRef.current = ref)}
      onPlaceChanged={onPlaceChanged}
    >
      <input
        type="text"
        ref={inputRef}
        placeholder="Enter a location (e.g. Paris)"
        className="w-full border rounded-md px-3 py-2 bg-transparent"
        defaultValue={location}
      />
    </Autocomplete>
  );
}
