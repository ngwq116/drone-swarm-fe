import type { TDrones } from "../types/types";
import Button from "./Button";

type ModalAlertProps = {
  criticals: TDrones[];
  setAlertDismissed: (dismissed: boolean) => void;
};

const ModalAlert = ({ criticals, setAlertDismissed }: ModalAlertProps) => {
  return (
    <div className="relative bg-[#0C1E38] border border-red-500 rounded-sm shadow-[0_0_40px_rgba(255,71,87,0.25)] w-full max-w-md mx-4">
      {/* Flashing top bar */}
      <div className="h-1 bg-red-500 animate-pulse" />

      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-red-500/30 bg-red-500/10">
        <span className="text-red-400 text-xl animate-pulse">⚠</span>
        <div>
          <p className="font-share-tech-mono text-[11px] text-red-400/60 tracking-widest">
            SWARMSAR — MISSION CONTROL
          </p>
          <p className="font-share-tech-mono text-[13px] text-red-400 font-bold tracking-widest">
            CRITICAL BATTERY ALERT
          </p>
        </div>
        <span className="ml-auto font-share-tech-mono text-[9px] text-red-400/40">
          {new Date().toLocaleTimeString("en-GB", { hour12: false })}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-5">
        <p className="font-share-tech-mono text-[11px] text-[#7CA5C9] leading-relaxed tracking-wide">
          The following drones have dropped below critical battery threshold.
          Immediate recall is required to prevent field loss.
        </p>

        {/* Drone chips */}
        <div className="mt-4 flex flex-wrap gap-2">
          {criticals.map((d) => (
            <div
              key={d.id}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/50 rounded-sm"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="font-share-tech-mono text-[11px] text-red-400">
                {d.id}
              </span>
              <span className="font-share-tech-mono text-[10px] text-red-400/50">
                {d.battery}%
              </span>
            </div>
          ))}
        </div>

        {/* Recommended action */}
        <div className="mt-4 px-3 py-2.5 bg-[#081428] border border-[#0F3460] rounded-sm">
          <p className="font-share-tech-mono text-[9px] text-[#7CA5C9]/60 tracking-widest mb-1">
            RECOMMENDED ACTION
          </p>
          <p className="font-share-tech-mono text-[11px] text-[#00E5FF]">
            → Initiate immediate recall-for-charging protocol
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-2 px-5 pb-5">
        <Button
          handleClick={() => setAlertDismissed(true)}
          label="ACKNOWLEDGE"
          className="bg-red-500/10 hover:bg-red-500/20 border-red-500/50 hover:border-red-500 text-red-400 py-2 text-[11px] tracking-widest font-share-tech-mono"
        />
      </div>
    </div>
  );
};

export default ModalAlert;
