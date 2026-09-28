import { AircraftDataType } from "@/functions/types";
import DataScreen from "./dataScreen";

const formatValue = (value: string | number | undefined) =>
  value === undefined || value === null ? "N/A" : String(value);

const formatSpeed = (value?: number) =>
  value === undefined ? "N/A" : `${Math.round(value)} kts`;

const formatAltitude = (value?: number | "ground") =>
  value === undefined
    ? "N/A"
    : value === "ground"
    ? "ground"
    : `${Math.round(value)} ft`;

const formatLatLon = (value?: number) =>
  value === undefined ? "N/A" : value.toFixed(5);

export default function ComplexAircraftData(props: {
  aircraft: AircraftDataType;
}) {
  const aircraft = props.aircraft;

  let verticalRateChar = "";
  if (aircraft.baro_rate !== undefined) {
    if (aircraft.baro_rate > 500) verticalRateChar = "▲";
    else if (aircraft.baro_rate < -500) verticalRateChar = "▼";
    else if (aircraft.baro_rate > 100) verticalRateChar = "△";
    else if (aircraft.baro_rate < -100) verticalRateChar = "▽";
    else verticalRateChar = "-";
  }

  const callsign =
    aircraft.flight && aircraft.flight.trim() !== ""
      ? aircraft.flight.trim()
      : aircraft.r ?? "UNKNOWN";

  return (
    <DataScreen>
      <div className="grid w-full gap-6 md:grid-cols-[1.3fr_1fr]">
        <div className="space-y-4">
          <div className="grid gap-2">
            <p className="text-[100px] font-bold text-right leading-[1.05]">
              {callsign}
            </p>
            <p className="text-[28px] text-right">
              {aircraft.desc ?? aircraft.t ?? "Unknown type"}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[18px]">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Baro Alt
              </p>
              <p>{formatAltitude(aircraft.alt_baro)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Geom Alt
              </p>
              <p>{formatAltitude(aircraft.alt_geom)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Ground Speed
              </p>
              <p>{formatSpeed(aircraft.gs)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                IAS / TAS
              </p>
              <p>
                {formatSpeed(aircraft.ias)} / {formatSpeed(aircraft.tas)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-[18px]">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Track
              </p>
              <p>{formatValue(aircraft.track)}°</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Heading
              </p>
              <p>{formatValue(aircraft.true_heading ?? aircraft.mag_heading)}°</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Vertical Rate
              </p>
              <p>
                {aircraft.baro_rate !== undefined
                  ? `${aircraft.baro_rate} fpm ${verticalRateChar}`
                  : "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Category / Squawk
              </p>
              <p>
                {aircraft.category ?? "N/A"} / {formatValue(aircraft.squawk)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 text-[18px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Distance
              </p>
              <p>{aircraft.dist !== undefined ? `${aircraft.dist} km` : "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Priority
              </p>
              <p>{formatValue(Math.round(aircraft.priority ?? 0))}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                NAV QNH
              </p>
              <p>{formatValue(aircraft.nav_qnh)} hPa</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                NAV Modes
              </p>
              <p>{aircraft.nav_modes ?? "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                MCP / FMS
              </p>
              <p>
                {formatValue(aircraft.nav_altitude_mcp)} / {formatValue(aircraft.nav_altitude_fms)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Messages / Seen
              </p>
              <p>
                {formatValue(aircraft.messages)} / {formatValue(aircraft.seen)}s
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Location
              </p>
              <p>
                {formatLatLon(aircraft.lat)}, {formatLatLon(aircraft.lon)}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Flags
              </p>
              <p className="space-x-2">
                {aircraft.isMilitary ? "MIL" : ""}
                {aircraft.isInteresting ? "INT" : ""}
                {aircraft.isPIA ? "PIA" : ""}
                {aircraft.isLADD ? "LADD" : ""}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Operator
              </p>
              <p>{aircraft.ownOp ?? "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-[0.2em] text-zinc-500">
                Registration
              </p>
              <p>{aircraft.r ?? "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </DataScreen>
  );
}
