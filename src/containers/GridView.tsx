import TitleSection from "../components/TitleSection";
import type { TCell, TDrones } from "../types/types";
import { LEGEND_COLORS, GRID } from "../constants/constants";

type GridViewProps = {
  cells: TCell[];
  drones: TDrones[];
};

const GridView = ({ cells, drones }: GridViewProps) => {
  const cellBg = (cell: TCell, drones: TDrones[]) => {
    const drone = drones.find(
      (d) => d.x === cell.x && d.y === cell.y && d.status !== "FAILED",
    );
    if (drone) return drone.status === "CHARGING" ? "#ffb703" : "#00e5ff";
    if (cell.found) return "#7c5200";
    if (cell.hazard) return "#2d0a00";
    if (cell.visited) return "#0a2e1a";
    return "#0c1e38";
  };

  return (
    <div className="shrink-0 flex flex-col">
      <TitleSection label="DISASTER ZONE — LIVE GRID VIEW" />
      {/* Legend */}
      <div className="flex gap-2.5 mb-1.5 font-share-tech-mono text-[8.5px] text-[#7ca5c9] flex-wrap">
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
            (d) => d.x === cell.x && d.y === cell.y && d.status !== "FAILED",
          );
          return (
            <div
              key={`${cell.x}-${cell.y}`}
              className="w-6 h-6 flex items-center justify-center text-[7px] transition-colors duration-200"
              style={{
                background: cellBg(cell, drones),
                outline: drone
                  ? `1px solid ${drone.status === "CHARGING" ? "#ffb703" : "#00e5ff"}`
                  : "none",
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
