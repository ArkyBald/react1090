import { ReactNode } from "react";

export default function DataScreen(props : {children : ReactNode}) {
  return (
    <div className="flex-shrink-none min-w-full snap-center">
      <div className="w-[80%] flex flex-row mx-auto bg-zinc-50 dark:bg-black rounded-lg p-4 opacity-80 justify-center">
        {props.children}
      </div>
    </div>
  );
}
