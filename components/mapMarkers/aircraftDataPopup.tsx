import { AircraftDataType } from "@/functions/types";
import { Popup } from "react-map-gl/maplibre";

export default function AircraftDataPopup(props: {
  aircraftData: AircraftDataType;
}) {
  let aircraft = props.aircraftData;

  return (
    <Popup
      anchor="left"
      longitude={aircraft.lon as number}
      latitude={aircraft.lat as number}
      closeButton={false}
      closeOnClick={false}
      offset={15}
      className="leading-none"
      style={{
        backgroundColor: "black",
        borderRadius: "0.5rem",
        opacity: 0.5,
        zIndex: 10,
      }}
    >
      {<p className={"text-[10px]"}>{aircraft.flight ? (aircraft.flight.includes("@") ? aircraft.r : aircraft.flight) : aircraft.r}</p>}
      {aircraft.alt_baro && aircraft.alt_baro !== "ground" && (
        <p className={"text-[10px]"}>{aircraft.alt_baro + "ft"}</p>
      )}
      {aircraft.t && <p className={"text-[10px]"}>{aircraft.t}</p>}
      {/* <p className={aircraft.priority > 1000 ? "font-bold" : ""}>{Math.round(aircraft.priority)}</p> */}
    </Popup>
  );
}
