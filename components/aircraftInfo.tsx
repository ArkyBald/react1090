"use client";

import { getAircraft } from "@/app/page";
import { use, useEffect, useState } from "react";



export default function AircraftInfo(){
    // var allPosts = use(data)
    
    // refresh()
    const [aircraftData, setAircraftData] = useState({now: new Date(), messages: "", aircraft: []} as {now: Date; messages: string; aircraft: []});

    useEffect(() => {
        const id = setInterval(() => {
            getAircraft().then((data : {now: number; messages: string; aircraft: []}) => {
                console.log(data.now);
                setAircraftData({now : new Date(data.now * 1000), messages: data.messages, aircraft: data.aircraft});
                console.log(aircraftData.now);
            });
 
        }, 1000);
        
        
        return () => 
            clearInterval(id);
    }, []);


    return (
        <div className="flex flex-col items-center gap-6 text-center sm:items-center sm:text-left">
            <h1 className="text-2xl font-bold">Aircraft Information</h1>
            <p suppressHydrationWarning>Number of Aircraft: {aircraftData.aircraft.length}</p>

            <p suppressHydrationWarning>Last Updated: {aircraftData.now.toLocaleTimeString()}</p>
        </div>
    )
    

}