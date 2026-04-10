"use client";

import { getAircraft } from "@/app/page";
import { ADSBDataType, AircraftDataType } from "@/functions/types";
import { useEffect, useState } from "react";


function updateFromPartial<T>(oldData: T, newData: Partial<T>): T {
    return {...oldData, ...newData};
}


export default function AircraftInfo(){
    // var allPosts = use(data)
    
    // refresh()
    const [storedAircraftData, setStoredAircraftData] = useState({now: new Date(), messages: 0, aircraft: {}} as ADSBDataType);
    // const [storedAircraftData, setStoredAircraftData] = useState({now: new Date(), messages: 0, aircraft: []});


    useEffect(() => {
        const id = setTimeout(() => {
            getAircraft().then((data : {now: number; messages: number; aircraft: AircraftDataType[]}) => {
                var newAircraftData : ADSBDataType = {now : new Date(data.now * 1000), messages: data.messages, aircraft: {}};
                
                console.log("Parsing Aircraft");

                for (let i = 0; i < data.aircraft.length; i++) {
                    const aircraft = data.aircraft[i];


                    if (aircraft.hex === undefined) continue;

                    if (!(aircraft.hex as string in storedAircraftData.aircraft)) {
                        newAircraftData.aircraft[aircraft.hex as string] = aircraft;
                        console.log("New Aircraft Detected: " + aircraft.hex);
                    }
                    else {
                        newAircraftData.aircraft[aircraft.hex as string] = updateFromPartial(storedAircraftData.aircraft[aircraft.hex as string], aircraft);
                        console.log("Updated Aircraft: " + aircraft.hex);
                    };

                    setStoredAircraftData(newAircraftData);
                };
            });
        }, 1000);

        return () => {
            clearTimeout(id);
        };
    }, [storedAircraftData]);


    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-center sm:text-left">
            <h1 className="text-2xl font-bold">Aircraft Information</h1>
            <p suppressHydrationWarning>Number of Aircraft: {Object.keys(storedAircraftData.aircraft).length}</p>
            {Object.keys(storedAircraftData.aircraft).length > 0 ? <p className="text-2xl">{storedAircraftData.aircraft[Object.keys(storedAircraftData.aircraft)[0]].alt_baro}</p> : <p>No Visible Aircraft!</p>}
            {/* {storedAircraftData.aircraft.length > 0 ? <p>{storedAircraftData.aircraft[0].hex}</p> : <p></p>} */}
            <button onClick={() => console.log(storedAircraftData)}>Log Aircraft Data</button>
            <p suppressHydrationWarning>Last Updated: {storedAircraftData.now.toLocaleTimeString()}</p>
        </div>
    )
    

}