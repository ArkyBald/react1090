"use client";

import { getAircraft } from "@/app/page";
import { ADSBDataType, AircraftDataType } from "@/functions/types";
import { useEffect, useState } from "react";
import MapScreen from "./mapScreen";
import Papa from "papaparse";
// import aircraftCSV from "../data/aircraft.csv";

function updateFromPartial<T>(oldData: T, newData: Partial<T>): T {
    return {...oldData, ...newData};
}


export const receiverLocation = {
    queenstown: {lat: -45.02363586425781, lon: 168.6907501220703},
    crawford: {lat: -46.40049743652344, lon: 168.37973022460938, bearing : 314}
}.crawford;

const aircraftCSV = await fetch("/aircraft.csv");
const aircraftParsedCSV = Papa.parse(await aircraftCSV.text(), { header: false }).data;

function findAircraftInfo(hex: string) : {registration?: string , stype?: string, ltype?: string, yom?: number, operator?: string} {
    // Implementation for finding aircraft info based on hex code
    const aircraftDetails : string[][] = aircraftParsedCSV.filter((row : string[], index: number, array: string[][]) => row[0] == hex.toLocaleUpperCase());
    console.log(aircraftDetails);
    if (aircraftDetails.length > 0) {
        return {registration: aircraftDetails[0][1], stype: aircraftDetails[0][2], ltype: aircraftDetails[0][4], yom: aircraftDetails[0][5] ? parseInt(aircraftDetails[0][5]) : undefined, operator: aircraftDetails[0][6]};
    }
    else {
        return {};
    }
}

export default function AircraftInfo(){
    // var allPosts = use(data)
    
    // refresh()
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


    useEffect(() => {
        const id = setTimeout(() => {
            getAircraft().then((data : {now: number; messages: number; aircraft: AircraftDataType[]}) => {
                var newAircraftData : ADSBDataType = {now : new Date(data.now * 1000), messages: data.messages, aircraft: {}};
                // Note this automatically prunes the list based on the Seen limit set on ReadSB

                for (let i = 0; i < data.aircraft.length; i++) {
                    const aircraft = data.aircraft[i];

                    if (aircraft.hex === undefined) continue;
                    if (aircraft.alt_baro === 'ground') continue;

                    if (!(aircraft.hex as string in storedAircraftData.aircraft)) {
                        newAircraftData.aircraft[aircraft.hex as string] = aircraft;
                        
                        newAircraftData.aircraft[aircraft.hex as string] = updateFromPartial(newAircraftData.aircraft[aircraft.hex as string], findAircraftInfo(aircraft.hex as string));
                        console.log("New Aircraft Detected: " + aircraft.hex);
                    }
                    else {
                        newAircraftData.aircraft[aircraft.hex as string] = updateFromPartial(storedAircraftData.aircraft[aircraft.hex as string], aircraft);
                    };

                    // Calculate distance from receiver and add it to the aircraft data
                    newAircraftData.aircraft[aircraft.hex as string].dist = 
                        Math.sqrt(Math.pow(aircraft.lat as number - receiverLocation.lat, 2) + Math.pow(aircraft.lon as number - receiverLocation.lon, 2)) * 111; // Approximate conversion from degrees to kilometers
                    newAircraftData.aircraft[aircraft.hex as string].dist = Math.round(newAircraftData.aircraft[aircraft.hex as string].dist * 100) / 100; // Round to 2 decimal places
                    };

                newAircraftData.aircraft = Object.fromEntries(Object.entries(newAircraftData.aircraft).sort(([,a], [,b]) => (a.dist as number) - (b.dist as number)));

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
            {Object.keys(storedAircraftData.aircraft).length <= 2 ? // FIXME - this is set temporarily to work on the map screen, but should be changed back to 0 or 1 for production
            <div className="flex flex-row items-center justify-center bg-zinc-50 dark:bg-black">
                <MapScreen aircraftData={storedAircraftData}/>
            </div>  
            
            :
            
            <div  className="flex-col">
                <div className="flex flex-row items-center justify-left bg-zinc-50 dark:bg-black">
                    <div className="flex flex-1 flex-col justify-baseline gap-0 leading-none">                    
                        <p className="flex-1 text-[10vw] text-right">{primaryAircraft?.flight == "@@@@@@@@" ? primaryAircraft.registration : primaryAircraft?.flight}</p>
                        {primaryAircraft?.ltype ? <p className="text-center text-sm text-gray-500 dark:text-gray-400">{primaryAircraft?.ltype}</p> : <p className="text-center text-sm text-gray-500 dark:text-gray-400">{primaryAircraft?.stype}</p>}
                        {primaryAircraft?.yom && <p className="text-center text-sm text-gray-500 dark:text-gray-400">{primaryAircraft?.yom}</p>}
                        {primaryAircraft?.operator && <p className="text-center text-sm text-gray-500 dark:text-gray-400">{primaryAircraft?.operator}</p>}
                    </div>
                    <div className="flex flex-1 flex-row text-left justify-baseline">
                        <div className="flex-1 flex-col text-left">
                            <p className="text-[4vw] leading-none">{primaryAircraft?.dist} km</p>
                            <p className="text-[4vw] leading-none">{primaryAircraft?.gs} kt</p>
                        </div>
                        <div className="flex-1 flex-col text-right">
                            <p className="text-[4vw] leading-none">{primaryAircraft?.alt_baro} ft</p>
                            <p className="text-[4vw] leading-none">{primaryAircraft?.baro_rate} ft/min</p>
                        </div>
                    </div>
                    {/* {storedAircraftData.aircraft.length > 0 ? <p>{storedAircraftData.aircraft[0].hex}</p> : <p></p>} */}
                    {/* <button onClick={() => console.log(storedAircraftData.aircraft)}>Log Aircraft Data</button> */}
                    {/* <p>Last Updated: {storedAircraftData.now.toLocaleTimeString()}</p> */}
                </div>
                

            </div>}
        </div>
    )
    

}