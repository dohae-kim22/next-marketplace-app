"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "200px",
};

export default function LocationMap({
  lat,
  lng,
}: {
  lat: number;
  lng: number;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={{ lat, lng }}
      zoom={15}
    >
      <Marker position={{ lat, lng }} />
    </GoogleMap>
  );
}
