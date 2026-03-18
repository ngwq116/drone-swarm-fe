import CardFleetStatus from "../components/CardFleetStatus";
import TitleSection from "../components/TitleSection";
import type { TDrones } from "../types/types";

type FleetStatusProps = {
  drones: TDrones[];
};

const FleetStatus = ({ drones }: FleetStatusProps) => {
  return (
    <div className="shrink-0 pt-1">
      <TitleSection label="FLEET STATUS" />
      {drones.map((d) => {
        const borderColorMap: Record<string, string> = {
          ACTIVE: "#2ed573",
          CHARGING: "#ffb703",
          FAILED: "#ff4757",
          STANDBY: "#4a4a6a",
        };
        const borderColor =
          d.batch === 2 && d.status === "ACTIVE"
            ? "#ff9500"
            : borderColorMap[d.status];
        const statusColor = {
          ACTIVE: "text-emerald-400",
          CHARGING: "text-amber-400",
          FAILED: "text-red-400",
          STANDBY: "text-[#4a4a6a]",
        }[d.status];
        const icon = { ACTIVE: "●", CHARGING: "⚡", FAILED: "✗", STANDBY: "◌" }[d.status];
        const battCls =
          d.battery > 50
            ? "text-emerald-400"
            : d.battery > 25
              ? "text-amber-400"
              : "text-red-400";
        return (
          <CardFleetStatus
            key={d.id}
            id={d.id}
            batch={d.batch}
            borderColor={borderColor}
            statusColor={statusColor}
            battCls={battCls}
            icon={icon}
            battery={d.battery}
            status={d.status}
            x={d.x}
            y={d.y}
            found={d.found}
            moves={d.moves}
          />
        );
      })}
    </div>
  );
};

export default FleetStatus;
