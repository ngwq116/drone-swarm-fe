import type { TSim } from "../types/types";

type MissionKPIsProps = {
  sim: TSim;
  coverage: number;
  activeCount: number;
  avgBatt: number;
  battColor: string;
};

const MissionKPIs = ({
  sim,
  coverage,
  activeCount,
  avgBatt,
  battColor,
}: MissionKPIsProps) => {
  const MISSION_KPIS = [
    {
      label: "SURVIVORS",
      value: `${sim.foundTotal} / ${sim.totalSurvivors}`,
      cls: "text-[#00e5ff]",
    },
    { label: "COVERAGE", value: `${coverage}%`, cls: "text-[#00b4cc]" },
    {
      label: "ACTIVE DRONES",
      value: `${activeCount} / ${sim.drones.length}`,
      cls: "text-emerald-400",
    },
    { label: "AVG BATTERY", value: `${avgBatt}%`, cls: battColor },
  ];

  return (
    <div className="px-3 py-2.5 flex-1 overflow-hidden">
      <div className="font-barlow text-[9px] text-[#7ca5c9] tracking-widest mb-2">
        MISSION KPIs
      </div>
      {MISSION_KPIS.map((k) => (
        <div key={k.label} className="mb-2.5">
          <div className="font-barlow text-[8px] text-[#7ca5c9] tracking-wide mb-0.5">
            {k.label}
          </div>
          <div className={`font-share-tech-mono text-xl leading-none ${k.cls}`}>
            {k.value}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MissionKPIs;
