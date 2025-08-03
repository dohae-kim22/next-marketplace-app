import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { useRef, useState, useEffect } from "react";

interface LocationPickerProps {
  errors?: string[];
  onChange: (value: { lat: number; lng: number; address?: string }) => void;
  defaultValue?: string;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

// Paris
const defaultCenter = {
  lat: 48.8566,
  lng: 2.3522,
};

export default function LocationPicker({
  errors = [],
  onChange,
  defaultValue,
}: LocationPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [localErrors, setLocalErrors] = useState<string[]>([]); 

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const { latitude, longitude } = pos.coords;
        setCenter({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  useEffect(() => {
    if (!isLoaded || !defaultValue || position) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: defaultValue }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const location = results[0].geometry.location;
        const lat = location.lat();
        const lng = location.lng();
        const address = results[0].formatted_address;

        const newPosition = { lat, lng, address };
        setCenter({ lat, lng });
        setPosition(newPosition);
        if (inputRef.current) inputRef.current.value = address;
        onChange(newPosition);
      }
    });
  }, [defaultValue, isLoaded, position, onChange]);

  const onPlaceChanged = () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;

    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address;

    const countryComponent = place.address_components?.find((c) =>
      c.types.includes("country")
    );

    if (countryComponent?.short_name !== "FR") {
      setPosition(null);
      onChange({ lat: NaN, lng: NaN, address: undefined });
      if (inputRef.current) inputRef.current.value = "";
      setLocalErrors(["Only locations in France are allowed."]);
      return;
    }

    setCenter({ lat, lng });
    setPosition({ lat, lng, address });
    if (inputRef.current && address) inputRef.current.value = address;
    setLocalErrors([]);
    onChange({ lat, lng, address });
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (!lat || !lng) return;

    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat, lng } });

    if (!res.results || res.results.length === 0) return;

    const address = res.results[0].formatted_address;
    const countryComponent = res.results[0].address_components.find((c) =>
      c.types.includes("country")
    );

    if (countryComponent?.short_name !== "FR") {
      setPosition(null);
      onChange({ lat: NaN, lng: NaN, address: undefined });
      if (inputRef.current) inputRef.current.value = "";
      setLocalErrors(["Only locations in France are allowed."]);
      return;
    }

    setPosition({ lat, lng, address });
    if (inputRef.current && address) inputRef.current.value = address;
    setLocalErrors([]);
    onChange({ lat, lng, address });
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-neutral-300 lg:text-base">
        Choose a meeting spot on the map
      </label>

      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "fr" },
        }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Search address..."
          defaultValue={defaultValue}
          className="w-full bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
        />
      </Autocomplete>

      {localErrors.map((error) => (
        <span key={error} className="text-red-500 text-sm">
          {error}
        </span>
      ))}

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={15}
        onClick={handleMapClick}
      >
        {position && <Marker position={position} />}
      </GoogleMap>
    </div>
  );
}
