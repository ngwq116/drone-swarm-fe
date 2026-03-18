import TitleSection from "../components/TitleSection";
import type { TCell, TDrones } from "../types/types";
import { LEGEND_COLORS, GRID } from "../constants/constants";

type GridViewProps = {
  cells: TCell[];
  drones: TDrones[];
};

function droneColor(drone: TDrones): string {
  if (drone.status === "CHARGING") return "#ffb703";
  if (drone.batch === 2) return "#ff9500"; // backup active
  return "#00e5ff"; // primary active
}

const GridView = ({ cells, drones }: GridViewProps) => {
  return (
    <div className="shrink-0 flex flex-col w-auto">
      <TitleSection label="DISASTER ZONE — LIVE GRID VIEW" />
      {/* Legend */}
      <div className="flex gap-2.5 mb-1.5 font-share-tech-mono text-[8.5px] text-[#7ca5c9] flex-wrap max-w-[500px]">
        {LEGEND_COLORS.map(([bg, lbl]) => (
          <span key={lbl} className="flex items-center gap-1">
            <span
              className="inline-block w-2 h-2 border border-[#0f3460] shrink-0"
              style={{ background: bg }}
            />
            {lbl}
          </span>
        ))}
      </div>
      {/* Grid cells */}
      <div
        className="grid gap-px shrink-0"
        style={{
          gridTemplateColumns: `repeat(${GRID}, 24px)`,
          background: "#0f3460",
          border: "1px solid #0f3460",
        }}
      >
        {cells.flat().map((cell) => {
          const drone = drones.find(
            (d) =>
              d.x === cell.x &&
              d.y === cell.y &&
              d.status !== "FAILED" &&
              d.status !== "STANDBY",
          );
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className="w-6 h-6 flex items-center justify-center text-[7px] transition-colors duration-200"
              style={{
                background: drone
                  ? droneColor(drone)
                  : cell.found
                    ? "#7c5200"
                    : cell.hazard
                      ? "#2d0a00"
                      : cell.visited
                        ? "#0a2e1a"
                        : "#0c1e38",
                outline: drone ? `1px solid ${droneColor(drone)}` : "none",
              }}
            >
              {drone ? (
                <span
                  style={{
                    color: drone.status === "CHARGING" ? "#000" : "#003355",
                    fontSize: 8,
                    fontWeight: 700,
                  }}
                >
                  ▲
                </span>
              ) : cell.found ? (
                <span className="text-amber-400">✓</span>
              ) : cell.survivor ? (
                <span>!</span>
              ) : cell.hazard ? (
                <span className="text-red-500 opacity-40">×</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GridView;
