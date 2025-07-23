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
  const [localErrors, setLocalErrors] = useState<string[]>(errors);
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
    if (JSON.stringify(localErrors) !== JSON.stringify(errors)) {
      setLocalErrors(errors);
    }
  }, [errors]);

  useEffect(() => {
    if (!isLoaded || !defaultValue || position) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: defaultValue }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const { lat, lng } = results[0].geometry.location;
        const latNum = typeof lat === "function" ? lat() : lat;
        const lngNum = typeof lng === "function" ? lng() : lng;
        const address = results[0].formatted_address;

        const newPosition = { lat: latNum, lng: lngNum, address };
        setCenter({ lat: latNum, lng: lngNum });
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
    const address = res.results[0]?.formatted_address;

    setPosition({ lat, lng, address });
    if (inputRef.current && address) inputRef.current.value = address;
    setLocalErrors([]);
    onChange({ lat, lng, address });
  };

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-neutral-700">
        Choose a meeting spot on the map
      </label>
      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
      >
        <>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search address..."
            className="w-full bg-transparent border-none rounded-md focus:outline-none transition h-10 ring-1 ring-neutral-200 focus:ring-2 focus:ring-orange-500 placeholder:text-neutral-400"
          />
          {localErrors &&
            localErrors.map((error) => (
              <span key={error} className="text-red-500 text-sm">
                {error}
              </span>
            ))}
        </>
      </Autocomplete>

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
