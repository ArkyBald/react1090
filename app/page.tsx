"use server";

import AircraftInfo from "@/components/aircraftInfo";
import { AircraftDataType } from "@/functions/types";
import { Suspense } from "react";

export async function getAircraft() {
  const data = await fetch("http://192.168.200.100/tar1090/data/aircraft.json");
  const jsonData  = await data.json() as {now: number; messages: number; aircraft: []};
 
  const test = 
  {  
    now: 1775544619.2,
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

  if (jsonData.aircraft.length > 0) {
    return jsonData as {now: number; messages: number; aircraft: AircraftDataType[]};
    }
  else
    return test as {now: number; messages: number; aircraft: AircraftDataType[]};
}

export default async function Home() {
  return (
      <main className="h-full min-h-screen w-full max-w-full items-center place-content-center-safe scroll-py-16 px-8 bg-white dark:bg-black">
        <Suspense fallback={<div>Loading...</div>}>
          <AircraftInfo/>
        </Suspense>
        
      </main>
  );
}
