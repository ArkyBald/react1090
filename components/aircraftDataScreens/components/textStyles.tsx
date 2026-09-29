import React from "react";

export function SmallText(props: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[70px] text-white/15 [text-shadow:1px_1px_0px_rgba(255,255,255,0.1),_-1px_-1px_1px_rgba(0,0,0,0.4)] font-bold">
        {props.children}
    </p>
  );
}

export function MajorText(props: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-[180px] font-bold justify-self-end flex-1 text-white/15 [text-shadow:1px_1px_0px_rgba(255,255,255,0.1),_-1px_-1px_1px_rgba(0,0,0,0.4)]">
        {props.children}
    </p>
  );
}
