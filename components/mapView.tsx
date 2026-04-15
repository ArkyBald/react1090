"use client";

import { getAircraft } from "@/app/page";
import { ADSBDataType, AircraftDataType } from "@/functions/types";
import { useEffect, useState } from "react";
import MapScreen from "./map";
import Papa from "papaparse";
import SimpleAircraftData from "./simpleAircraftData";
// import aircraftCSV from "../aircraft.csv";

function updateFromPartial<T>(oldData: T, newData: Partial<T>): T {
    return {...oldData, ...newData};
}


export const receiverLocation = {
    queenstown: {lat: -45.02363586425781, lon: 168.6907501220703},
    crawford: {lat: -46.40049743652344, lon: 168.37973022460938, bearing : 314, elevation: 5}
}.crawford;



function findAircraftInfo(hex: string, aircraftParsedCSV: string[][]): {registration?: string , stype?: string, ltype?: string, yom?: number, operator?: string} {
    // Implementation for finding aircraft info based on hex code
    const aircraftDetails : string[][] = aircraftParsedCSV.filter((row : string[], index: number, array: string[][]) => row[0] == hex.toLocaleUpperCase());
    if (aircraftDetails.length > 0) {
        return {registration: aircraftDetails[0][1], stype: aircraftDetails[0][2], ltype: aircraftDetails[0][4], yom: aircraftDetails[0][5] ? parseInt(aircraftDetails[0][5]) : undefined, operator: aircraftDetails[0][6]};
    }
    else {
        return {};
    }
}


function calculateAircraftPriority(aircraft: AircraftDataType) : number {
    // Implementation for calculating aircraft priority based on various factors
    let priority = 0;

    aircraft.squawk === "7600" ? priority += 9000 : undefined // Communication Failure
    aircraft.squawk === "7700" ? priority += 10000 : undefined // General Emergency
    aircraft.squawk === "7500" ? priority += 11000 : undefined // Hijacking

    aircraft.mach as number > 0.8 ? priority += 1000 : priority += aircraft.gs as number
    
    Math.abs(aircraft.roll as number) > 45 ? priority += 500 : undefined // Unusual Attitude

    Math.abs(aircraft.baro_rate as number) > 3000 ? priority += 300 : undefined // Rapid Climb/Descent

    priority -= aircraft.seen as number * 100;

    if (aircraft.category?.startsWith("A")) {
        switch (aircraft.category) {
            case "A1": priority += 100; break; // Light (< 15,500 lbs)
            case "A2": priority += 200; break; // Small (15,500 - 75,000 lbs)
            case "A3": priority += 300; break; // Large (75,000 - 300,000 lbs)
            case "A4": priority += 400; break; // High Vortex Large (300,000 - 750,000 lbs)
            case "A5": priority += 500; break; // Heavy (> 750,000 lbs)
            case "A6": priority += 600; break; // High Performance (e.g. supersonic)
            case "A7": priority += 200; break; // Rotorcraft
        }
    }
    aircraft.category?.startsWith("B") ? priority += 300 : undefined // Lighter-than-air, gliders, etc.
    aircraft.category?.startsWith("C") ? priority -= 100 : undefined // Surface vehicles and obstacles

    priority += 5000 / (aircraft.dist as number); // Closer aircraft are higher priority
    priority += 2000 / (aircraft.alt_baro as number - receiverLocation.elevation); // Lower altitude aircraft are higher priority

    return priority;
}

export default function MapView(){
    const [storedAircraftData, setStoredAircraftData] = useState({now: new Date(), messages: 0, aircraft: {}} as ADSBDataType);

    const [primaryAircraft, setPrimaryAircraft] = useState(undefined as AircraftDataType | undefined);

    const [testAircraftData, setTestAircraftData] = useState({now: new Date(), messages: 1, aircraft: 
        {c82af1 : {
            hex: 'c82af1',
            flight: 'ZKIDH   ',
            alt_baro: 3625,
            alt_geom: 3625,
            gs: 123.3,
            track: 0,
            baro_rate: 0,
            squawk: '1500',
            category: 'A7',
            lat: -46.40049743652344, 
            lon: 168.37973022460938,
            nic: 8,
            rc: 186,
            seen_pos: 47.5,
            version: 2,
            nic_baro: 1,
            nac_p: 9,
            nac_v: 2,
            sil: 3,
            sil_type: 'perhour',
            gva: 2,
            sda: 2,
            mlat: [],
            tisb: [],
            messages: 407,
            seen: 41.6,
            rssi: -36.4} as AircraftDataType
        }} as ADSBDataType);

    const [aircraftParsedCSV, setAircraftParsedCSV] = useState([] as string[][]);

    
    useEffect(() => {
        // Fetch from the public folder
        fetch('/aircraft.csv')
            .then((response) => response.text())
            .then((responseText) => {
                // Parse CSV string into JSON
                console.log("Success!")
                Papa.parse(responseText, {
                skipEmptyLines: true,
                complete: (results) => {
                setAircraftParsedCSV(results.data as string[][]);
                },
            });
        });
    }, []);

    // Updates the aircraft JSON data every minute from the Raspberry Pi
    useEffect(() => {
        const id = setTimeout(() => {
            getAircraft().then((data : {now: number; messages: number; aircraft: AircraftDataType[]}) => {
                var newAircraftData : ADSBDataType = {now : new Date(data.now * 1000), messages: data.messages, aircraft: {}};
                // Note this automatically prunes the list based on the Seen limit set on ReadSB

                for (let i = 0; i < data.aircraft.length; i++) {
                    const aircraft = data.aircraft[i];

                    if (aircraftParsedCSV.length == 0) continue

                    if (aircraft.hex === undefined) continue;
                    // if (aircraft.alt_baro === 'ground') continue;

                    if (!(aircraft.hex as string in storedAircraftData.aircraft)) {
                        newAircraftData.aircraft[aircraft.hex as string] = aircraft;
                        newAircraftData.aircraft[aircraft.hex as string] = updateFromPartial(newAircraftData.aircraft[aircraft.hex as string], findAircraftInfo(aircraft.hex as string, aircraftParsedCSV));

                        console.log("New Aircraft Detected: " + aircraft.hex + ", " + findAircraftInfo(aircraft.hex as string, aircraftParsedCSV).registration);
                    }
                    else {
                        newAircraftData.aircraft[aircraft.hex as string] = updateFromPartial(storedAircraftData.aircraft[aircraft.hex as string], aircraft);
                    };

                    // Calculate distance from receiver and add it to the aircraft data
                    const aircraftData = newAircraftData.aircraft[aircraft.hex as string]!;
                    aircraftData.dist = 
                        Math.sqrt(Math.pow(aircraft.lat as number - receiverLocation.lat, 2) + Math.pow(aircraft.lon as number - receiverLocation.lon, 2)) * 111; // Approximate conversion from degrees to kilometers
                    aircraftData.dist = Math.round(aircraftData.dist * 100) / 100; // Round to 2 decimal places

                    // Calculate priority and add it to the aircraft data
                    aircraftData.priority = calculateAircraftPriority(aircraftData);
                };

                newAircraftData.aircraft = Object.fromEntries(Object.entries(newAircraftData.aircraft).sort(([,a], [,b]) => (a.priority as number) - (b.priority as number)));

                setStoredAircraftData(newAircraftData);
                setPrimaryAircraft(newAircraftData.aircraft[Object.keys(newAircraftData.aircraft)[0]]);

            });
        }, 1000);

        return () => {
            clearTimeout(id);
        };
    }, [storedAircraftData]);


    return (
        <div>
            <MapScreen aircraftData={storedAircraftData}/>
            {primaryAircraft ? 
            <div  className="flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                <SimpleAircraftData aircraft={primaryAircraft as AircraftDataType}/>

            </div> : undefined}
        </div>
    )
    

}