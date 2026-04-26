"use client";

import { getAircraft } from "@/app/page";
import { ADSBDataType, AircraftDataType } from "@/functions/types";
import { useEffect, useState } from "react";
import MapScreen from "./map";
import SimpleAircraftData from "./aircraftDataScreens/simpleAircraftData";
import { time } from "console";
import DebugAircraftData from "./aircraftDataScreens/debugAircraftData";

function updateFromPartial<T>(oldData: T, newData: Partial<T>): T {
  return { ...oldData, ...newData };
}

export const receiverLocation = {
  queenstown: {
    lat: -45.02363586425781,
    lon: 168.6907501220703,
    bearing: 144,
    elevation: 1439,
  }, // Bearings should be in true north.
  crawford: {
    lat: -46.40049743652344,
    lon: 168.37973022460938,
    bearing: 314,
    elevation: 5,
  },
}.queenstown;

function calculateAircraftPriority(aircraft: AircraftDataType): number {
  // Implementation for calculating aircraft priority based on various factors
  let priority = 0;

  aircraft.squawk === "7600" ? (priority += 9000) : undefined; // Communication Failure
  aircraft.squawk === "7700" ? (priority += 10000) : undefined; // General Emergency
  aircraft.squawk === "7500" ? (priority += 11000) : undefined; // Hijacking

  (aircraft.mach as number) > 0.8
    ? (priority += 1000)
    : (priority += aircraft.gs as number);

  Math.abs(aircraft.roll as number) > 45 ? (priority += 500) : undefined; // Unusual Attitude

  Math.abs(aircraft.baro_rate as number) > 3000 ? (priority += 300) : undefined; // Rapid Climb/Descent

  priority -= (aircraft.seen as number) * 100;

  if (aircraft.category?.startsWith("A")) {
    switch (aircraft.category) {
      case "A1":
        priority += 100;
        break; // Light (< 15,500 lbs)
      case "A2":
        priority += 200;
        break; // Small (15,500 - 75,000 lbs)
      case "A3":
        priority += 300;
        break; // Large (75,000 - 300,000 lbs)
      case "A4":
        priority += 400;
        break; // High Vortex Large (300,000 - 750,000 lbs)
      case "A5":
        priority += 500;
        break; // Heavy (> 750,000 lbs)
      case "A6":
        priority += 600;
        break; // High Performance (e.g. supersonic)
      case "A7":
        priority += 200;
        break; // Rotorcraft
    }
  }
  aircraft.category?.startsWith("B") ? (priority += 300) : undefined; // Lighter-than-air, gliders, etc.
  aircraft.category?.startsWith("C") ? (priority -= 500) : undefined; // Surface vehicles and obstacles

  priority += 5000 / (aircraft.dist as number); // Closer aircraft are higher priority
  if (aircraft.alt_baro !== "ground") {
    priority +=
      2000 / ((aircraft.alt_baro as number) - receiverLocation.elevation); // Lower altitude aircraft are higher priority
  } else priority -= 500;

  return priority;
}

export default function MapView() {
  const [storedAircraftData, setStoredAircraftData] = useState({
    now: new Date().valueOf(),
    messages: 0,
    aircraft: {},
  } as ADSBDataType);
  const [primaryAircraft, setPrimaryAircraft] = useState(
    undefined as AircraftDataType | undefined,
  );

  const [testAircraftData, setTestAircraftData] = useState({
    now: new Date().valueOf(),
    messages: 1,
    aircraft: {
      "7c77f7": {
        hex: "7c77f7",
        type: "adsb_icao",
        flight: "QFA123  ",
        r: "VH-XZD",
        t: "B738",
        desc: "BOEING 737-800",
        ownOp: "QANTAS AIRWAYS LIMITED",
        year: "2013",
        alt_baro: 1325,
        alt_geom: 1500,
        gs: 131.9,
        track: 252.8,
        geom_rate: -576,
        category: "A0",
        lat: -45.013962,
        lon: 168.773542,
        nic: 8,
        rc: 186,
        seen_pos: 0.117,
        r_dst: 3.554,
        r_dir: 80.6,
        version: 0,
        nac_p: 8,
        nac_v: 2,
        sil: 2,
        sil_type: "unknown",
        alert: 0,
        spi: 0,
        mlat: [],
        tisb: [],
        messages: 1135,
        seen: 0.1,
        rssi: -19.8,
        isInteresting: false,
        isPIA: false,
        isLADD: false,
        isMilitary: false,
        dist: 9.25,
        priority: 644.8966808914176,
        squawk: "1516",
        nav_qnh: 1018.2,
        nav_altitude_mcp: 9008,
        nav_altitude_fms: 1216,
        ias: 138,
        mach: 0.212,
        mag_heading: 227.29,
        true_heading: 252.52,
        baro_rate: -832,
        tas: 142,
        wd: 248,
        ws: 12,
        track_rate: 0.12,
        roll: 0.88,
        priorityTime: 1777194058,
      } as AircraftDataType,
    },
  } as ADSBDataType);

  const aircraftPriorityThreshold = -100000;

  // Updates the aircraft JSON data every minute from the Raspberry Pi
  useEffect(() => {
    const id = setTimeout(() => {
      getAircraft().then(
        (data: {
          now: number;
          messages: number;
          aircraft: AircraftDataType[];
        }) => {
          var newAircraftData: ADSBDataType = {
            now: data.now,
            messages: data.messages,
            aircraft: {},
          };
          // Note this automatically prunes the list based on the Seen limit set on ReadSB

          for (let i = 0; i < data.aircraft.length; i++) {
            const aircraft = data.aircraft[i];

            // if (aircraftParsedCSV.length == 0) continue

            if (aircraft.hex === undefined) continue;

            if (!((aircraft.hex as string) in storedAircraftData.aircraft)) {
              newAircraftData.aircraft[aircraft.hex as string] = aircraft;
              console.log(
                "New Aircraft Detected: " + aircraft.hex + ", " + aircraft.r,
              );
            } else {
              newAircraftData.aircraft[aircraft.hex as string] =
                updateFromPartial(
                  storedAircraftData.aircraft[aircraft.hex as string],
                  aircraft,
                );
            }

            // Calculate DBFlags (given from aircraft database)
            if (aircraft.dbFlags !== undefined) {
              // Bitwise check against the flags
              aircraft.isInteresting = (aircraft.dbFlags & 2) !== 0;
              aircraft.isPIA = (aircraft.dbFlags & 4) !== 0;
              aircraft.isLADD = (aircraft.dbFlags & 8) !== 0;
              aircraft.isMilitary = (aircraft.dbFlags & 1) !== 0;
            } else {
              aircraft.isInteresting = false;
              aircraft.isPIA = false;
              aircraft.isLADD = false;
              aircraft.isMilitary = false;
            }

            // Calculate distance from receiver and add it to the aircraft data
            const aircraftData =
              newAircraftData.aircraft[aircraft.hex as string]!;
            aircraftData.dist =
              Math.sqrt(
                Math.pow((aircraft.lat as number) - receiverLocation.lat, 2) +
                  Math.pow((aircraft.lon as number) - receiverLocation.lon, 2),
              ) * 111; // Approximate conversion from degrees to kilometers
            aircraftData.dist = Math.round(aircraftData.dist * 100) / 100; // Round to 2 decimal places

            // Calculate priority and add it to the aircraft data
            aircraftData.priority = calculateAircraftPriority(aircraftData);
          }

          newAircraftData.aircraft = Object.fromEntries(
            Object.entries(newAircraftData.aircraft).sort(
              ([, a], [, b]) => (b.priority as number) - (a.priority as number),
            ),
          );

          if (Object.entries(data.aircraft).length <= 2)
            newAircraftData = testAircraftData;

          if (Object.entries(newAircraftData.aircraft).length > 0) {
            let potentialAircraft =
              newAircraftData.aircraft[
                Object.keys(newAircraftData.aircraft)[0]
              ];

            // If the aircraft is high priority, check if there is alread a high priority aircraft to replace
            if (
              potentialAircraft.priority > aircraftPriorityThreshold &&
              potentialAircraft.hex !== primaryAircraft?.hex
            ) {
              // If there is already a primary aircraft, check if we should replace it
              if (primaryAircraft) {
                const currentPrimaryAircraft = Object.entries(
                  newAircraftData.aircraft,
                ).find((value) => (value[0] = primaryAircraft.hex as string));

                // If aircraft has been primary for greater than 2 seconds, or if we trump its priority two-fold, replace it.
                if (
                  newAircraftData.now - primaryAircraft?.priorityTime > 2 ||
                  potentialAircraft.priority > primaryAircraft.priority * 2 ||
                  currentPrimaryAircraft == undefined
                ) {
                  potentialAircraft.priorityTime = newAircraftData.now;
                  setPrimaryAircraft(potentialAircraft);
                } else {
                  // else we should keep the aircraft the same
                  setPrimaryAircraft(currentPrimaryAircraft[1]);
                }
              } else {
                newAircraftData.aircraft[
                  Object.keys(newAircraftData.aircraft)[0]
                ].priorityTime = newAircraftData.now;
                setPrimaryAircraft(
                  newAircraftData.aircraft[
                    Object.keys(newAircraftData.aircraft)[0]
                  ],
                );
              }
            } else {
              if (primaryAircraft) {
                if (
                  potentialAircraft.hex == primaryAircraft?.hex &&
                  potentialAircraft.priority > aircraftPriorityThreshold
                ) {
                  potentialAircraft.priorityTime = newAircraftData.now;
                  setPrimaryAircraft(potentialAircraft);
                } else if (
                  newAircraftData.now - potentialAircraft.priorityTime >
                  5
                ) {
                  // newAircraftData.aircraft[0].priorityTime = newAircraftData.now
                  setPrimaryAircraft(undefined);
                }
              }
            }
          }

          console.log(Object.values(newAircraftData.aircraft)[0].priority);
          setStoredAircraftData(newAircraftData);
        },
      );
    }, 1000);

    return () => {
      clearTimeout(id);
    };
  }, [storedAircraftData]);

  return (
    <div>
      <MapScreen
        aircraftData={storedAircraftData}
        primaryAircraft={primaryAircraft}
      />
      {primaryAircraft !== undefined ? (
        <div className="flex w-full flex-nowrap absolute bottom-0 left-0 overflow-x-scroll snap-x snap-mandatory">
          <SimpleAircraftData aircraft={primaryAircraft} />
          <DebugAircraftData aircraft={primaryAircraft} />
        </div>
      ) : undefined}
    </div>
  );
}
