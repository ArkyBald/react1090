"use server";

import AircraftInfo from "@/components/aircraftInfo";
import Clock from "@/components/clock";
import { AircraftDataType } from "@/functions/types";
import { Suspense } from "react";

export async function getAircraft() {
  const data = await fetch("http://192.168.1.27:8080/data/aircraft.json");
  const jsonData  = await data.json() as {now: number; messages: string; aircraft: []};
  // console.log(aircraft.now);
 
  

  if (jsonData.aircraft.length > 0) {
    console.log(jsonData);
    return jsonData as {now: number; messages: string; aircraft: AircraftDataType[]};
    }
  else
    return {  now: 1775544619.2,
      messages: 39406,
      aircraft: [
        {
          
      hex: 'c82af1',
      flight: 'ZKIDH   ',
      alt_baro: 3625,
      alt_geom: 3625,
      gs: 123.3,
      track: 67.6,
      baro_rate: 0,
      squawk: '1500',
      category: 'A7',
      lat: -46.393524,
      lon: 168.538848,
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
      rssi: -36.4
    
        }
  ]
};
}

export default async function Home() {
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
