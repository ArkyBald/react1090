"use server";

import AircraftInfo from "@/components/aircraftInfo";
import Clock from "@/components/clock";
import { Suspense } from "react";

export async function getAircraft() {
  const data = await fetch("http://192.168.1.68:8080/data/aircraft.json");
  const aircraft = await data.json();
  // console.log(aircraft.now);
 
  // console.log(aircraft);
  return aircraft as {now: number; messages: string; aircraft: []};
}

export default async function Home() {
  // const aircraft = getAircraft();
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-full flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-center sm:text-left">
          <Clock />
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <AircraftInfo/>
        </Suspense>
        
      </main>
    </div>
  );
}
