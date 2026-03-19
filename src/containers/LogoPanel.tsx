import type { TSim } from "../types/types";

type LogoPanelProps = {
  sim: TSim;
};

const LogoPanel = ({ sim }: LogoPanelProps) => {
  return (
    <div className="px-3.5 pt-3.5 pb-2.5 border-b border-[#0f3460]">
      <div className="font-barlow text-base font-bold tracking-[3px] text-[#00e5ff]">
        ⬡ SWARMSAR
      </div>
      <div className="font-share-tech-mono text-[9px] text-[#7ca5c9] tracking-[1px] mt-0.5">
        MISSION CONTROL v1.0
      </div>
      <div className="font-share-tech-mono text-[9px] text-[#7ca5c9] text-left mt-2">
        <span className={sim.complete ? "text-[#00e5ff]" : "text-emerald-400"}>
          {sim.complete ? "✦ MISSION COMPLETE" : "● MISSION ACTIVE"}
        </span>
      </div>
    </div>
  );
};

export default LogoPanel;
