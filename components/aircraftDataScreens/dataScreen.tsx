import { ReactNode } from "react";

export default function DataScreen(props : {children : ReactNode}) {
  return (
    <div className="flex-shrink-none min-w-full snap-center">
      <div className="w-[80%] flex flex-row mx-auto justify-center">
        {props.children}
      </div>
    </div>
  );
}
