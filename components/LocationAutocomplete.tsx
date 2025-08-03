"use client";

import { Autocomplete, useLoadScript } from "@react-google-maps/api";
import { useRef, useState } from "react";

export default function LocationAutocomplete({
  onSelect,
  onChange,
  location,
}: {
  onSelect: (value: { address: string; lat: number; lng: number }) => void;
  onChange?: () => void;
  location?: string;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place?.geometry || !place?.formatted_address) {
      setError("Please select a location from the list.");
      return;
    }

    setError("");
    const lat = place.geometry.location?.lat();
    const lng = place.geometry.location?.lng();
    if (lat && lng) {
      onSelect({ address: place.formatted_address, lat, lng });
    }
  };

  const handleBlur = async () => {
    const value = inputRef.current?.value;
    if (!value) {
      onSelect({ address: "", lat: 0, lng: 0 });
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
          className="w-full border rounded-md px-3 py-2 bg-transparent"
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
