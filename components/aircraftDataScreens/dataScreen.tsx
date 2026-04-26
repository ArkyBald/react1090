import { ReactNode } from "react";

export default function DataScreen(props : {children : ReactNode}) {
  return (
    <div className="flex-shrink-none min-w-full snap-center">
      <div className="w-[50%] flex flex-row mx-auto align-text-top bg-zinc-50 dark:bg-black rounded-lg p-4 opacity-80">
        {props.children}
      </div>
    </div>
  );
}
