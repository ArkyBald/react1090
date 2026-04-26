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
      <div className="flex-1 flex-col leading-none">
        <p className="text-[100px] line-height-[100px] text-right">
          {aircraft.flight?.includes("@") || aircraft.flight == ""
            ? aircraft.r
            : aircraft.flight}
        </p>
        <span className="text-left leading-none">
          {aircraft.desc ? aircraft.desc : aircraft.t}
        </span>
      </div>
      <div className="flex-1 flex-col leading-none">
        <p className="text-[40px] line-height-[40px]">
          {aircraft.alt_baro + "ft " + verticalRateChar}
        </p>
        <p className="text-[40px] line-height-[40px]">{aircraft.gs + "kts"}</p>
        <p className="text-right">
          {aircraft.flight?.trim() == aircraft.r?.trim().replaceAll("-", "")
            ? aircraft.year
            : aircraft.r}
        </p>
      </div>
    </DataScreen>
  );
}
