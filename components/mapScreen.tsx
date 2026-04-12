"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Map, { MapRef, Marker, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";

import { receiverLocation } from "./aircraftInfo";
import { ADSBDataType, AircraftDataType } from "@/functions/types";


export default function MapScreen(props: {aircraftData: {now: Date; messages: number; aircraft: {[key: string]: AircraftDataType}}}) {
    const [time, setTime] = useState(new Date());
    const mapRef = useRef<MapRef | null>(null);

    const onMapLoad = useCallback(() => {
        mapRef.current?.setBearing(receiverLocation.bearing as number + 26);
        mapRef.current?.panBy([0, -200], {duration: 0});
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <Map
                ref = {mapRef}
                onLoad={onMapLoad}
                initialViewState={{
                    bounds: [
                        receiverLocation.lon - 0.1, // West
                        receiverLocation.lat - 0.1, // South
                        receiverLocation.lon + 0.1, // East
                        receiverLocation.lat + 0.1  // North
                    ],
                    // zoom: 20
                }}
                style={{width: "100vw", height: "100vh", borderRadius: "0.5rem"}}
                mapStyle="https://api.maptiler.com/maps/dataviz-v4-dark/style.json?key=BhDT1UCr6jz4pV9uUNPc"
            >   
                {props.aircraftData.aircraft && Object.values(props.aircraftData.aircraft).map((aircraft) => (
                    <Marker
                        key={aircraft.hex}
                        longitude={aircraft.lon as number}
                        latitude={aircraft.lat as number}
                        rotationAlignment="map"
                        // element={} // FIXME - this may be the appropraite method to set the plane icon
                        rotation={aircraft.track as number - 45} // FIXME - this is a temporary fix to align the plane icon, but should be changed to use the actual bearing of the plane in future
                    >
                        <div>
                            <p>{"✈️" + aircraft.flight}</p>
                            {/* <p>{aircraft.alt_baro} ft</p> */}
                        </div>
                    </Marker>
                ))}
            </Map>
            <h1 suppressHydrationWarning className="absolute top-5/6 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full text-9xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">{time.toLocaleTimeString()}</h1>

        </div>
    );
}