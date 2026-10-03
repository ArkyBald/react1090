import { AircraftDataType } from "@/functions/types";
import DataScreen from "./dataScreen";
import { MajorText, SmallText } from "./components/textStyles";

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
      <div className="z-1 grid grid-rows-1 grid-cols-2 grid-flow-col gap-x-4 items-center">
        {/* Aircraft Flight (ANZ432), or if this is blank or in error, the Registration (ZKMVP) */}
        <MajorText>
          {
            aircraft.flight?.includes("@") || aircraft.flight == undefined
              ? aircraft.r?.trim()
              : aircraft.flight.trim()
          }
        </MajorText>
        
        <div className="grid grid-rows-2 grid-cols-2 grid-flow-col leading-none flex-1">
          {/* Aircraft Registration (ZKMVP), or if flight (ANZ432) is blank or the same as registration, distance? KM? FIXME update this to something better */}
          <SmallText>
            {
              !((aircraft.flight?.trim() == aircraft.r) || (aircraft.flight?.includes("@") || aircraft.flight == undefined))
              ? aircraft.r
              : aircraft.dist
            }
          </SmallText>

          {/* Aircraft Type (ATR76), or if not present, FIXME */}
          <SmallText>
            {
              aircraft.t
              ? aircraft.t
              : "no type info"
            }
          </SmallText>

          {/* Aircraft Groundspeed (123kts), or if not present, IAS (111kts),  */}
          <SmallText>
            {
              aircraft.gs
              ? aircraft.gs + "kts"
              : aircraft.ias + "kts"
            }
          </SmallText>
          
          {/* Aircraft altitude in Baro (1111ft) + vertical rate character (▲), unless on the Ground, then (taxiing) */}
          <SmallText>
            {
              aircraft.alt_baro !== "ground"
              ? aircraft.alt_baro + "ft " + verticalRateChar
              : "taxiing"
            }
          </SmallText>  
        </div>     
      </div>
    </DataScreen>
  );
}
