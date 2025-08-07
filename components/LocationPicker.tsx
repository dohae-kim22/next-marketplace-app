import {
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
} from "@react-google-maps/api";
import { useTranslations } from "next-intl";
import { useRef, useState, useEffect } from "react";

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

interface LocationPickerProps {
  errors?: string[];
  onChange: (value: LocationData) => void;
  defaultValue?: string;
}

const containerStyle = {
  width: "100%",
  height: "300px",
};

// Paris
const defaultCenter = { lat: 48.8566, lng: 2.3522 };

export default function LocationPicker({
  errors = [],
  onChange,
  defaultValue,
}: LocationPickerProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const [position, setPosition] = useState<LocationData | null>(null);
  const [center, setCenter] = useState(defaultCenter);
  const [localErrors, setLocalErrors] = useState<string[]>([]);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const t = useTranslations("locationPicker");

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

        const { street, city, state, postalCode, countryCode } =
          parseAddressComponents(results[0].address_components);

        const newPosition: LocationData = {
          lat,
          lng,
          location: address,
          street,
          city,
          state,
          postalCode,
          countryCode,
        };

        setCenter({ lat, lng });
        setPosition(newPosition);
        if (inputRef.current) {
          inputRef.current.value = address;
        }
        onChange(newPosition);
      }
    });
  }, [defaultValue, isLoaded, position, onChange]);

  const onPlaceChanged = async () => {
    if (!autocompleteRef.current) return;
    const place = autocompleteRef.current.getPlace();
    if (!place.geometry || !place.geometry.location) return;
    const lat = place.geometry.location.lat();
    const lng = place.geometry.location.lng();
    const address = place.formatted_address || "";

    const { street, city, state, postalCode, countryCode } =
      parseAddressComponents(place.address_components || []);

    if (countryCode !== "FR") {
      setPosition(null);
      onChange({ lat: NaN, lng: NaN });
      if (inputRef.current) inputRef.current.value = "";
      setLocalErrors([t("onlyFrance")]);
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

    setCenter({ lat, lng });
    setPosition(parsed);
    if (inputRef.current && address) inputRef.current.value = address;
    setLocalErrors([]);
    onChange(parsed);
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    const lat = e.latLng?.lat();
    const lng = e.latLng?.lng();
    if (!lat || !lng) return;

    const geocoder = new google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat, lng } });

    if (!res.results || res.results.length === 0) return;

    const address = res.results[0].formatted_address;
    const { street, city, state, postalCode, countryCode } =
      parseAddressComponents(res.results[0].address_components);

    if (countryCode !== "FR") {
      setPosition(null);
      onChange({ lat: NaN, lng: NaN });
      if (inputRef.current) inputRef.current.value = "";
      setLocalErrors(["Only locations in France are allowed."]);
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

    setPosition(parsed);
    if (inputRef.current && address) inputRef.current.value = address;
    setLocalErrors([]);
    onChange(parsed);
  };

  if (!isLoaded) return <p>{t("loading")}</p>;

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-medium text-neutral-300 lg:text-base">
        {t("label")}
      </label>

      <Autocomplete
        onLoad={(ref) => (autocompleteRef.current = ref)}
        onPlaceChanged={onPlaceChanged}
        options={{ componentRestrictions: { country: "fr" } }}
      >
        <input
          ref={inputRef}
          type="text"
          placeholder={t("searchPlaceholder")}
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
