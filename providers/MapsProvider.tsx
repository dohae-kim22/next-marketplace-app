"use client";

import { createContext, useContext, useMemo } from "react";
import { useLoadScript } from "@react-google-maps/api";

type MapsContextValue = {
  isLoaded: boolean;
};

const MapsContext = createContext<MapsContextValue>({ isLoaded: false });

export function MapsProvider({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const value = useMemo(() => ({ isLoaded }), [isLoaded]);

  return <MapsContext.Provider value={value}>{children}</MapsContext.Provider>;
}

export const useGoogleMaps = () => useContext(MapsContext);
