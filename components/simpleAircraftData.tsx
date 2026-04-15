import { AircraftDataType } from "@/functions/types";




export default function SimpleAircraftData(props: {aircraft: AircraftDataType}) {
    const aircraft = props.aircraft;

    let verticalRateChar = "";
    if (aircraft.baro_rate !== undefined) {
        if (aircraft.baro_rate > 500) verticalRateChar = "▲";
        else if (aircraft.baro_rate < -500) verticalRateChar = "▼";
        else if (aircraft.baro_rate > 100) verticalRateChar = "△";
        else if (aircraft.baro_rate < -100) verticalRateChar = "▽";
        else verticalRateChar = "-";
    }

    return (
        <div className="flex items-center bg-zinc-50 dark:bg-black rounded-lg p-4 opacity-80">
            <div className="flex-1 flex-col leading-none">
                <p className="text-[100px] text-right">{aircraft.flight == "@@@@@@@@" || aircraft.flight == "" ? aircraft.registration : aircraft.flight}</p>
                <span className="text-left leading-none">{aircraft.ltype ? aircraft.ltype : aircraft.stype}</span>
            </div>
            <div className="flex-1 flex-col leading-none">
                <p className="text-[40px] line-height-[40px]">{aircraft.alt_baro + "ft " + verticalRateChar}</p>
                <p className="text-[40px] line-height-[40px]">{aircraft.gs + "kts"}</p>
                <p className="text-right">{aircraft.registration}</p>
            </div>
            
            {/* <div className="flex flex-1 flex-col justify-baseline gap-0 leading-none">                    
                <p className="flex-1 text-[10vw] text-right">{aircraft.flight == "@@@@@@@@" ? aircraft.registration : aircraft.flight}</p>
                {aircraft.ltype ? <p className="text-center text-sm text-gray-500 dark:text-gray-400">{aircraft.ltype}</p> : <p className="text-center text-sm text-gray-500 dark:text-gray-400">{aircraft.stype}</p>}
                {aircraft.yom && <p className="text-center text-sm text-gray-500 dark:text-gray-400">{aircraft.yom}</p>}
                {aircraft.operator && <p className="text-center text-sm text-gray-500 dark:text-gray-400">{aircraft.operator}</p>}
            </div>
            <div className="flex flex-1 flex-row text-left justify-baseline">
                <div className="flex-1 flex-col text-left">
                    <p className="text-[4vw] leading-none">{aircraft.dist} km</p>
                    <p className="text-[4vw] leading-none">{aircraft.gs} kt</p>
                </div>
                <div className="flex-1 flex-col text-right">
                    <p className="text-[4vw] leading-none">{aircraft.alt_baro} ft</p>
                    <p className="text-[4vw] leading-none">{aircraft.baro_rate} ft/min</p>
                </div>
            </div> */}
            {/* {storedAircraftData.aircraft.length > 0 ? <p>{storedAircraftData.aircraft[0].hex}</p> : <p></p>} */}
            {/* <button onClick={() => console.log(aircraft.ltype)}>Log Aircraft Data</button> */}
            {/* <p>Last Updated: {storedAircraftData.now.toLocaleTimeString()}</p> */}
        </div>

    )
}