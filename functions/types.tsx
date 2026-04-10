
export type ADSBDataType = {
    now: Date,
    messages: number,
    aircraft: {[key : string] : AircraftDataType},
}

// not the actual source but does have the same data structure.
// https://github.com/wiedehopf/readsb/blob/dev/README-json.md

export type AircraftDataType = {
    /** the 24-bit ICAO identifier of the aircraft, as 6 hex digits. The identifier may start with '~', this means that the address is a non-ICAO address (e.g. from TIS-B) */
    hex?: string, 
    /** not confident this is given - type of the message */
    type?: string,
    /** the callsign of the aircraft, as 8 characters. The callsign is right-padded with spaces if it is shorter than 8 characters. */
    flight?: string,
    /** the barometric altitude of the aircraft, in feet. or "ground" as a string */
    alt_baro?: number | "ground",
    /** the geometric altitude of the aircraft, in feet. This is the altitude as calculated by the receiver, based on the barometric altitude and the pressure at the receiver. */
    alt_geom?: number,
    /** the ground speed of the aircraft, in knots. */
    gs?: number,
    /** the indicated airspeed of the aircraft, in knots. */
    ias?: number,
    /** the true airspeed of the aircraft, in knots. */
    tas?: number,
    /** the Mach number of the aircraft. */
    mach?: number,
    /** the true track of the aircraft, in degrees. */
    track?: number,
    /** the rate of change of the track of the aircraft, in degrees per second. */
    track_rate?: number,
    /** the roll angle of the aircraft, in degrees. */
    roll?: number, 
    /** the magnetic heading of the aircraft, in degrees. */
    mag_heading?: number,
    /** the true heading of the aircraft, in degrees. (usally only given on the ground, in the air calculated via WMM2020) */
    true_heading?: number,
    /** the vertical rate of the aircraft, in feet per minute. */
    baro_rate?: number, 
    /** the geometric vertical rate of the aircraft, in feet per minute. */
    geom_rate?: number, 
    /** the squawk code of the aircraft, as 4 octal digits. */
    squawk?: string,
    /** the emergency status of the aircraft. This is a string that indicates the emergency status of the aircraft, and may be one of "none", "general", "lifeguard", "medical", "minimum fuel", "no communications", "unlawful interference", or "downed". */
    emergency?: string,
    /** ADS-B Emitter Category - A0-7 weight/wake vortex category (5 highest, 1 lowest, 6 high performance, 7 rotorcraft); B0-7 (1 Glider, 2 Lighter-than-air, 3 Parachutist, 4 Ultralight/Hang-glider, 5 reserved, 6 UAV, 7 Space/Trans-atmospheric vehicle); C0-7 (1 Surface Vehicle emergency, 2 Surface Vehicle service, 3 Point Obstacle, 4 Cluster Obstacle, 5 Line Obstacle, 6-7 reserved); D0-7 (1-7 reserved) */
    category?: string,
    /** the QNH setting of the aircraft, in hPa. */
    nav_qnh?: number,
    /** the altitude setting of the aircraft, in feet. */
    nav_altitude_mcp?: number,
    /** the altitude setting of the aircraft, in feet. */
    nav_altitude_fms?: number,
    /** the engaged nav_mode: 'autopilot', 'vnav', 'althold', 'approach', 'lnav', 'tcas' */
    nav_modes?: string,
    /** the latitude of the aircraft, in degrees. */
    lat?: number,
    /** the longitude of the aircraft, in degrees. */
    lon?: number,
    /** the Navigation Integrity Category of the aircraft. Defined in DO-260B. */
    nic?: number,
    /** radius of containment, meters */
    rc?: number,
    /** the time since the last position message was received from the aircraft, in seconds. */
    seen_pos?: number,
    /** the version of the Mode S transponder of the aircraft. */
    version?: number,
    /** the Navigation Integrity Category for barometric altitude of the aircraft. Defined in DO-260B. */
    nic_baro?: number,
    /** the Navigation Accuracy Category for position of the aircraft. Defined in DO-260B. */
    nac_p?: number,
    /** the Navigation Accuracy Category for velocity of the aircraft. Defined in DO-260B. */
    nac_v?: number,
    /** the System Integrity Level of the aircraft. Defined in DO-260B. */
    sil?: number,
    /** the type of the System Integrity Level of the aircraft. This is a string that indicates the type of the SIL, and may be one of "perhour", "perflight", or "permessage". */
    sil_type?: string,
    /** the Geometric Vertical Accuracy of the aircraft, in feet. Defined in DO-260B. */
    gva?: number,
    /** the System Design Assurance of the aircraft. Defined in DO-260B. */
    sda?: number,
    /** an array of multilateration position messages received from the aircraft. Each message contains: lat (latitude in degrees), lon (longitude in degrees), alt (altitude in feet), vr (vertical rate in feet per minute) */
    mlat?: [],
    /** an array of TIS-B position messages received from the aircraft. Each message contains: lat (latitude in degrees), lon (longitude in degrees), alt (altitude in feet) */
    tisb?: [],
    /** the number of messages received from the aircraft. */
    messages?: number,
    /** the time since the last message was received from the aircraft, in seconds. */
    seen?: number,
    /** the signal strength of the messages received from the aircraft, in dBFS. */
    rssi?: number,
    /** alert status */
    alert?: string,
    /** special position identification status */
    spi?: string,
    /** wind direction */
    wd?: number,
    /** wind speed */
    ws?: number,
    /** outside air temperature */
    oat?: number,
    /** total air temperature */
    tat?: number,
}