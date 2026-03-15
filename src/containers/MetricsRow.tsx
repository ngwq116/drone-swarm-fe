import MetricCard from "../components/MetricCard";
import type { TSim } from "../types/types";

type MetricsRowProps = {
  sim: TSim;
  mm: string;
  ss: string;
  coverage: number;
  activeCount: number;
  chargingCount: number;
  failedCount: number;
  avgBatt: number;
  battAccent: string;
};

const MetricsRow = ({
  sim,
  mm,
  ss,
  coverage,
  activeCount,
  chargingCount,
  failedCount,
  avgBatt,
  battAccent,
}: MetricsRowProps) => {
  return (
    <div className="grid grid-cols-5 gap-2 px-3.5 pt-2.5 pb-1.5 shrink-0">
      <MetricCard
        label="Sim Steps"
        value={`${sim.step}`}
        sub={`WALL: ${mm}:${ss}`}
        accentColor="border-t-[#7ca5c9]"
      />
      <MetricCard
        label="Survivors Found"
        value={`${sim.foundTotal}<span style="font-size:14px;color:#7ca5c9">/${sim.totalSurvivors}</span>`}
        sub={`DETECTION: ${sim.totalSurvivors ? Math.round((sim.foundTotal / sim.totalSurvivors) * 100) : 0}%`}
      />
      <MetricCard
        label="Area Coverage"
        value={`${coverage}<span style="font-size:14px;color:#7ca5c9">%</span>`}
        sub="OF 400 CELLS"
      />
      <MetricCard
        label="Fleet Status"
        value={`<span style="color:#2ed573;font-size:16px">${activeCount}A</span> <span style="color:#ffb703;font-size:16px">${chargingCount}C</span> <span style="color:#ff4757;font-size:16px">${failedCount}F</span>`}
        sub={`OF ${sim.drones.length} DRONES`}
      />
      <MetricCard
        label="Avg Fleet Battery"
        value={`${avgBatt}<span style="font-size:14px;color:#7ca5c9">%</span>`}
        accentColor={battAccent}
      />
    </div>
  );
};

export default MetricsRow;
