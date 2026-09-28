import { AircraftDataType } from "@/functions/types";
import DataScreen from "./dataScreen";

export default function DebugAircraftData(props: {
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
        <p className="text-[40px] text-right">
          {aircraft.flight?.includes("@") || aircraft.flight == ""
            ? aircraft.r
            : aircraft.flight}
        </p>
        <p className="text-[40px] text-right">
          {aircraft.desc + " | " + aircraft.t}
        </p>
        <p className="text-[40px] text-right">
          {aircraft.year}
        </p>
        <p className="text-[40px] text-left">
          {Math.round(aircraft.priority) + " " + Math.round((new Date().valueOf() / 1000) - aircraft.priorityTime)}
        </p>
        <button onClick={() => console.log(aircraft)}>Log Aircraft Data</button>
      </div>
    </DataScreen>
  );
}
