"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, { MapRef, Marker, Popup, Source } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
const geomag = require("geomag");

import { receiverLocation } from "./mapView";
import { ADSBDataType, AircraftDataType } from "@/functions/types";


export default function MapScreen(props: {aircraftData: {now: Date; messages: number; aircraft: {[key: string]: AircraftDataType}}}) {
    const [time, setTime] = useState(new Date());
    const mapRef = useRef<MapRef | null>(null);

    const angularDistance = 5/6371;
    const receiverBearingRad = (receiverLocation.bearing as number + 26) * Math.PI / 180;

    const receiverLatRad = receiverLocation.lat * Math.PI / 180;
    const receiverLonRad = receiverLocation.lon * Math.PI / 180;

    const mapLat = Math.asin   ((Math.sin(receiverLatRad) * Math.cos(angularDistance)) + 
                                (Math.cos(receiverLatRad) * Math.sin(angularDistance) * Math.cos((receiverBearingRad)))) * 180 / Math.PI;

    const mapLon = (receiverLonRad + Math.atan2( Math.sin(receiverBearingRad) * Math.sin(angularDistance) * Math.cos(receiverLatRad),
                                                Math.cos(angularDistance) - (Math.sin(receiverLatRad) * Math.sin(mapLat)))) * 180 / Math.PI;


    const declination = geomag.field(receiverLocation.lat, receiverLocation.lon).declination;
    
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
                latitude={mapLat}
                longitude={mapLon}
                bearing={receiverLocation.bearing + declination}
                zoom={11}
                minZoom={10}
                style={{width: "100vw", height: "100vh", borderRadius: "0.5rem"}}
                mapStyle="https://api.maptiler.com/maps/dataviz-v4-dark/style.json?key=BhDT1UCr6jz4pV9uUNPc"
            >   
                {props.aircraftData.aircraft && Object.values(props.aircraftData.aircraft).map((aircraft) => (
                    aircraft.lat === undefined || aircraft.lon === undefined ? null :
                    
                    <Marker
                        key={aircraft.hex}
                        longitude={aircraft.lon as number}
                        latitude={aircraft.lat as number}
                        rotation={aircraft.track as number + declination - 45} // FIXME - this is a temporary fix to align the plane icon, but should be changed to use the actual bearing of the plane in future
                    >
                        <p className="text-2xl">✈️</p>
                        <Popup
                            anchor="left"
                            longitude={aircraft.lon as number}
                            latitude={aircraft.lat as number}
                            closeButton={false}
                            closeOnClick={false}
                            >
                                <p>{aircraft.flight}</p>
                                <p>{aircraft.alt_baro + "ft"}</p>
                                <p>{aircraft.priority}</p>
                        </Popup>
                    </Marker>
                ))}
            </Map>
            <h1 suppressHydrationWarning className="absolute top-5/6 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full text-9xl font-semibold leading-10 tracking-tight text-black dark:text-[#DCE1DE]">{time.toLocaleTimeString()}</h1>
        </div>
    );
}