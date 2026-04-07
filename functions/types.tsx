
// not the actual source but does have the same data structure.
// https://github.com/wiedehopf/readsb/blob/dev/README-json.md

export type AircraftDataType = {
    hex?: string, 
    // the 24-bit ICAO identifier of the aircraft, as 6 hex digits. The identifier may start with '~', this means that the address is a non-ICAO address (e.g. from TIS-B)
    type?: string, // not confident this is given
    // type of the message
    flight?: string,
    // the callsign of the aircraft, as 8 characters. The callsign is right-padded with spaces if it is shorter than 8 characters.
    alt_baro?: number | "ground",
    // the barometric altitude of the aircraft, in feet. or "ground" as a string
    alt_geom?: number,
    // the geometric altitude of the aircraft, in feet. This is the altitude as calculated by the receiver, based on the barometric altitude and the pressure at the receiver.
    gs?: number,
    // the ground speed of the aircraft, in knots.
    ias?: number,
    // the indicated airspeed of the aircraft, in knots.
    tas?: number,
    // the true airspeed of the aircraft, in knots.
    mach?: number,
    // the Mach number of the aircraft.
    track?: number,
    // the true track of the aircraft, in degrees.
    track_rate?: number,
    // the rate of change of the track of the aircraft, in degrees per second.
    roll?: number,
    // the roll angle of the aircraft, in degrees. 
    mag_heading?: number,
    // the magnetic heading of the aircraft, in degrees.
    true_heading?: number,
    // the true heading of the aircraft, in degrees. (usally only given on the ground, in the air calculated via WMM2020)
    baro_rate?: number,
    // the vertical rate of the aircraft, in feet per minute. 
    geom_rate?: number,
    // the geometric vertical rate of the aircraft, in feet per minute. 
    squawk?: string,
    // the squawk code of the aircraft, as 4 octal digits. The squawk code is a code that is used by air traffic control to identify the aircraft. The squawk code may be empty if no squawk code has been received from the aircraft.
    emergency?: string,
    // the emergency status of the aircraft. This is a string that indicates the emergency status of the aircraft, and may be one of "none", "general", "lifeguard", "medical", "minimum fuel", "no communications", "unlawful interference", or "downed".
    category?: string,
    // ADS-B Emitter Category
    // A0-7 weight/wake vortex category. (5 highest, 1 lowest, 6 high performance, 7 rotorcraft)
    // B0-7 (1 Glider, 2 Lighter-than-air, 3 Parachutist, 4 Ultralight/Hang-glider, 5 reserved, 6 UAV, 7 Space/Trans-atmospheric vehicle)
    // C0-7 (1 Surface Vehicle (emergency), 2 Surface Vehicle (service), 3 Point Obstacle, 4 Cluster Obstacle, 5 Line Obstacle, 6-7 reserved)
    // D0-7 (1-7 reserved)
    nav_qnh?: number,
    // the QNH setting of the aircraft, in hPa. This is the QNH as reported by the aircraft, and may be different from the actual QNH at the location of the aircraft. The QNH may be null if no QNH has been received from the aircraft.
    nav_altitude_mcp?: number,
    // the altitude setting of the aircraft, in feet.
    nav_altitude_fms?: number,
    // the altitude setting of the aircraft, in feet.
    nav_modes?: string,
    // the engaged nav_mode: 'autopilot', 'vnav', 'althold', 'approach', 'lnav', 'tcas'
    lat?: number,
    // the latitude of the aircraft, in degrees. This is the latitude as reported by the aircraft, and may be different from the actual latitude of the aircraft. The latitude may be null if no position has been received from the aircraft.
    lon?: number,
    // the longitude of the aircraft, in degrees. This is the longitude as reported by the aircraft, and may be different from the actual longitude of the aircraft. The longitude may be null if no position has been received from the aircraft.
    nic?: number,
    // the Navigation Integrity Category of the aircraft. This is a measure of the integrity of the navigation information received from the aircraft, and is defined in DO-260B. The NIC may be null if no navigation information has been received from the aircraft.
    rc?: number,
    // radius of containment, meters
    seen_pos?: number,
    // the time since the last position message was received from the aircraft, in seconds. This is the time since the last position message as reported by the receiver, and may be different from the actual time since the last position message was received from the aircraft. The time since the last position message may be null if no position message has been received from the aircraft.
    version?: number,
    // the version of the Mode S transponder of the aircraft.
    nic_baro?: number,
    // the Navigation Integrity Category for barometric altitude of the aircraft. This is a measure of the integrity of the barometric altitude information received from the aircraft, and is defined in DO-260B. The NIC for barometric altitude may be null if no barometric altitude information has been received from the aircraft.
    nac_p?: number,
    // the Navigation Accuracy Category for position of the aircraft. This is a measure of the accuracy of the position information received from the aircraft, and is defined in DO-260B. The NAC for position may be null if no position information has been received from the aircraft.
    nac_v?: number,
    // the Navigation Accuracy Category for velocity of the aircraft. This is a measure of the accuracy of the velocity information received from the aircraft, and is defined in DO-260B. The NAC for velocity may be null if no velocity information has been received from the aircraft.
    sil?: number,
    // the System Integrity Level of the aircraft. This is a measure of the integrity of the information received from the aircraft, and is defined in DO-260B. The SIL may be null if no information has been received from the aircraft.
    sil_type?: string,
    // the type of the System Integrity Level of the aircraft. This is a string that indicates the type of the SIL, and may be one of "perhour", "perflight", or "permessage". The SIL type may be null if no SIL information has been received from the aircraft.
    gva?: number,
    // the Geometric Vertical Accuracy of the aircraft, in feet. This is a measure of the accuracy of the geometric altitude information received from the aircraft, and is defined in DO-260B. The GVA may be null if no geometric altitude information has been received from the aircraft.
    sda?: number,
    // the System Design Assurance of the aircraft. This is a measure of the design assurance of the information received from the aircraft, and is defined in DO-260B. The SDA may be null if no information has been received from the aircraft.
    mlat?: [],
    // an array of multilateration position messages received from the aircraft. Each message is an object that contains the following properties:
    // - lat: the latitude of the position message, in degrees. This is the latitude as reported by the receiver, and may be different from the actual latitude of the aircraft. The latitude may be null if no position message has been received from the aircraft.
    // - lon: the longitude of the position message, in degrees. This is the longitude as reported by the receiver, and may be different from the actual longitude of the aircraft. The longitude may be null if no position message has been received from the aircraft.
    // - alt: the altitude of the position message, in feet. This is the altitude as reported by the receiver, and may be different from the actual altitude of the aircraft. The altitude may be null if no position message has been received from the aircraft.
    // - vr: the vertical rate of the position message, in feet per minute. This is the vertical rate as reported by the receiver, and may be different from the actual vertical rate of the
    tisb?: [],
    // an array of TIS-B position messages received from the aircraft. Each message is an object that contains the following properties:
    // - lat: the latitude of the position message, in degrees. This is the latitude as reported by the receiver, and may be different from the actual latitude of the aircraft. The latitude may be null if no position message has been received from the aircraft.
    // - lon: the longitude of the position message, in degrees. This is the longitude as reported by the receiver, and may be different from the actual longitude of the aircraft. The longitude may be null if no position message has been received from the aircraft.
    // - alt: the altitude of the position message, in feet. This is the altitude as reported by the receiver, and may be different from the actual altitude of the aircraft. The altitude may be null if no position message has been received from the aircraft.
    messages?: number,
    // the number of messages received from the aircraft. This is the number of messages as reported by the receiver, and may be different from the actual number of messages received from the aircraft. The number of messages may be null if no messages have been received from the aircraft.
    seen?: number,
    // the time since the last message was received from the aircraft, in seconds. This is the time since the last message as reported by the receiver, and may be different from the actual time since the last message was received from the aircraft. The time since the last message may be null if no messages have been received from the aircraft.
    rssi?: number
    // the signal strength of the messages received from the aircraft, in dBFS. This is the signal strength as reported by the receiver, and may be different from the actual signal strength of the messages received from the aircraft. The signal strength may be null if no messages have been received from the aircraft.
    alert?: string,
    spi?: string
    wd?: number,
    ws?: number
    oat?: number,
    tat?: number,
}