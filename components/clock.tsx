"use client";

import { useEffect, useState } from "react";



export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (<h1 className="max-w-full text-9xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">{time.toLocaleTimeString()}</h1>)
}