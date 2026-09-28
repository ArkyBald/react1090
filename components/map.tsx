"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  ADSBDataType,
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

  const angularDistance = 10 / 6371;
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
    id: "roadLayer",
    type: "line",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": [
        "interpolate",
        ["linear"],
        ["get", "speed"],
        0,
        "#333333", // Low speed: Grey
        500,
        "#FFA500", // Mid speed: Orange
        1000,
        "#FF0000", // High speed: Red
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
        zoom={10}
        minZoom={9}
        style={{ width: "100vw", height: "100vh", borderRadius: "0.5rem" }}
        mapStyle="https://api.maptiler.com/maps/dataviz-v4-dark/style.json?key=BhDT1UCr6jz4pV9uUNPc"
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
            data={{
              type: "Feature",
              properties: {},
              geometry: {
                type: "LineString",
                coordinates: Object.values(
                  aircraft.aircraftTrace as AircraftPositionTrace[],
                ).map((aircraftTrace, index) => [
                  aircraftTrace.lon,
                  aircraftTrace.lat,
                ]),
              },
            }}
          >
            <Layer {...lineStyle} id={aircraft.hex} />
          </Source>
        ))}

        {/* {Object.entries(airports)
          .filter((airportObject) => airportObject[0].startsWith("NZ"))
          .map((airportObject) => (
            <Marker
              key={airportObject[0]}
              rotationAlignment="viewport"
              latitude={airportObject[1][0]}
              longitude={airportObject[1][1]}
            >
              <p>🛫 {airportObject[0]}</p>
            </Marker>
          ))} */}
      </Map>
      <h1
        suppressHydrationWarning
        className="absolute top-1/6 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-full text-9xl font-semibold leading-10 tracking-tight text-black dark:text-[#DCE1DE]"
      >
        {time.toLocaleTimeString()}
      </h1>
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
