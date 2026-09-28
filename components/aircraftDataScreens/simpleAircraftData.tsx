import { AircraftDataType } from "@/functions/types";
import DataScreen from "./dataScreen";

export default function SimpleAircraftData(props: {
  aircraft: AircraftDataType;
}) {
  const aircraft = props.aircraft;

  let verticalRateChar = "";

  if (aircraft.baro_rate) {
    if (aircraft.baro_rate !== undefined) {
      if (aircraft.baro_rate > 500) verticalRateChar = "▲";
      else if (aircraft.baro_rate < -500) verticalRateChar = "▼";
      else if (aircraft.baro_rate > 100) verticalRateChar = "△";
      else if (aircraft.baro_rate < -100) verticalRateChar = "▽";
      else verticalRateChar = "-";
    }
  }

  return (
    <DataScreen>
      <div className="grid grid-rows-3 grid-cols-2 grid-flow-col gap-x-4 items-center leading-none">
        <p className="row-span-2 text-[100px] font-bold justify-self-end">
          {aircraft.flight?.includes("@") || aircraft.flight == undefined
            ? aircraft.r
            : aircraft.flight}
        </p>
        {aircraft.desc ||
          aircraft.t ? (
            <p className="text-[30px] text-right">
              {aircraft.desc ? aircraft.desc : aircraft.t}
            </p>
          ) : undefined}
        <p className="text-[40px] text-left">
          {aircraft.alt_baro !== "ground"
            ? aircraft.alt_baro + "ft " + verticalRateChar
            : "taxiing"}
        </p>
        <p className="text-[40px] text-left">{aircraft.gs + "kts"}</p>
        {aircraft.r ||
          aircraft.flight ||
          aircraft.year ? (
            <p className="text-[30px] text-left">
              {aircraft.flight?.trim() == aircraft.r?.trim().replaceAll("-", "")
                ? aircraft.year
                : aircraft.r}
            </p>
          ) : undefined}
      </div>
    </DataScreen>
  );
}
