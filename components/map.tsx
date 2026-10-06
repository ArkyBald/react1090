"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import SimpleAircraftData from "./aircraftDataScreens/simpleAircraftData";
import ComplexAircraftData from "./aircraftDataScreens/complexAircraftData";
import DebugAircraftData from "./aircraftDataScreens/debugAircraftData";

import Map, {
  Layer,
  MapRef,
  Marker,
  Popup,
  Source,
} from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
const geomag = require("geomag");

import { receiverLocation } from "./mapView";
import {
  AircraftDataType,
  AircraftPositionTrace,
} from "@/functions/types";
import AircraftIcon from "./aircraftIcons";
import airports from "../public/airport-coords.json";
import AircraftDataPopup from "./mapMarkers/aircraftDataPopup";

export default function MapScreen(props: {
  aircraftData: {
    now: number;
    messages: number;
    aircraft: { [key: string]: AircraftDataType };
  };
  primaryAircraft?: AircraftDataType;
}) {
  const [time, setTime] = useState(new Date());
  const mapRef = useRef<MapRef | null>(null);

  const angularDistance = 2 / 6371;
  const receiverBearingRad =
    (((receiverLocation.bearing as number) + 26) * Math.PI) / 180;

  const receiverLatRad = (receiverLocation.lat * Math.PI) / 180;
  const receiverLonRad = (receiverLocation.lon * Math.PI) / 180;

  const mapLat =
    (Math.asin(
      Math.sin(receiverLatRad) * Math.cos(angularDistance) +
        Math.cos(receiverLatRad) *
          Math.sin(angularDistance) *
          Math.cos(receiverBearingRad),
    ) *
      180) /
    Math.PI;

  const mapLon =
    ((receiverLonRad +
      Math.atan2(
        Math.sin(receiverBearingRad) *
          Math.sin(angularDistance) *
          Math.cos(receiverLatRad),
        Math.cos(angularDistance) - Math.sin(receiverLatRad) * Math.sin(mapLat),
      )) *
      180) /
    Math.PI;

  const declination = geomag.field(
    receiverLocation.lat,
    receiverLocation.lon,
  ).declination;

  const lineStyle = {
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-gradient": [
        "interpolate",
        ["linear"],

        ["line-progress"],

        0,
        "#FF0000", // Recent record: Red
        0.5,
        "#FFA500", // Mid record: Orange
        1,
        "#333333", // Old record: Grey

        // ["get", "speed"],
        // 0,
        // "#333333", // Low speed: Grey
        // 500,
        // "#FFA500", // Mid speed: Orange
        // 1000,
        // "#FF0000", // High speed: Red
      ], //   "#888",
      "line-width": 4,
    },
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Map
        ref={mapRef}
        latitude={mapLat}
        longitude={mapLon}
        bearing={receiverLocation.bearing + declination}
        zoom={11}
        minZoom={9}
        style={{ width: "100vw", height: "100vh", borderRadius: "0.5rem" }}
        mapStyle="https://tiles.openfreemap.org/styles/dark"
        // mapStyle="https://api.maptiler.com/maps/dataviz-v4-dark/style.json?key=BhDT1UCr6jz4pV9uUNPc"
      >
        
        
        {props.aircraftData.aircraft &&
          Object.values(props.aircraftData.aircraft).map((aircraft) =>
            aircraft.lat === undefined || aircraft.lon === undefined ? null : (
              <Marker
                key={aircraft.hex}
                rotationAlignment="map"
                longitude={aircraft.lon as number}
                latitude={aircraft.lat as number}
                rotation={aircraft.track as number}
              >
                <AircraftIcon
                  category={aircraft.category as string}
                  type={aircraft.t || aircraft.desc}
                />
                <AircraftDataPopup aircraftData={aircraft} />
              </Marker>
            ),
          )}

        {Object.values(props.aircraftData.aircraft).map((aircraft) => (
          <Source
            id={aircraft.hex}
            key={aircraft.hex}
            type="geojson"
            lineMetrics={true}
            data={{
              type: "FeatureCollection",
              features: [
                {type: "Feature",
                properties: {},
                geometry: {
                  type: "LineString",
                  coordinates: Object.values(
                    aircraft.aircraftTrace as AircraftPositionTrace[],
                    ).map((aircraftTrace, index) => [
                    aircraftTrace.lon,
                    aircraftTrace.lat,
                  ]),
                  }
                }],
              }}
          >
            <Layer {...lineStyle} id={aircraft.hex} />
          </Source>
        ))}
        
        {(props.primaryAircraft) == undefined ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          
          <h1
            suppressHydrationWarning
            className="
              z-1
              font-mono
              font-bold
              tabular-nums
              tracking-[-0.065em]
              leading-none
              whitespace-nowrap
              select-none

              text-white/10

              text-shadow-[-3px_-3px_-3px_rgba(255,255,255,0.1)]
              text-shadow-[3px_3px_3px_rgba(0,0,0,0.1)]
              text-shadow-[0_0_6px_rgba(0,0,0,0.1)]
              
              text-[clamp(5rem,11vw,10rem)]
            "
          >
            {time.toLocaleTimeString()}
          </h1>
        </div>) : 
        (<div className="z-1 flex w-full flex-nowrap absolute bottom-0 left-0 overflow-x-scroll snap-x snap-mandatory">
          <SimpleAircraftData aircraft={props.primaryAircraft} />
          <ComplexAircraftData aircraft={props.primaryAircraft} />
          <DebugAircraftData aircraft={props.primaryAircraft} />
        </div>)}
      </Map>
    </div>
  );
}

// {props.aircraftData.aircraft &&
//           Object.values(props.aircraftData.aircraft).map((aircraft) =>
//             aircraft.lat === undefined || aircraft.lon === undefined
//               ? null
//               : Object.values(
//                   aircraft.aircraftTrace as AircraftPositionTrace[],
//                 ).map((aircraftTrace, index) => (
//                   <Marker
//                     key={aircraft.hex + "_" + index}
//                     rotationAlignment="map"
//                     longitude={aircraftTrace.lon as number}
//                     latitude={aircraftTrace.lat as number}
//                     // rotation={aircraft.track as number}
//                   >
//                     {/* <AircraftIcon
//                   category={aircraft.category as string}
//                   type={aircraft.t || aircraft.desc}
//                 />
//                 <AircraftDataPopup aircraftData={aircraft} /> */}{" "}
//                     .
//                   </Marker>
//                 )),
//           )}
