export const GRID = 20;
export const TOTAL = GRID * GRID;

export const SECTORS = {
  NW: [0, 10, 10, 20],
  NE: [10, 10, 20, 20],
  SW: [0, 0, 10, 10],
  SE: [10, 0, 20, 10],
  CENTRE: [7, 7, 13, 13],
};

export const LOG_COLORS = {
  SYS: "text-[#7ca5c9]",
  REASONING: "text-[#7eb8d4]",
  TOOL: "text-emerald-400",
  RESULT: "text-amber-400",
  ALERT: "text-red-400",
  COMPLETE: "text-[#00e5ff]",
};

export const LOG_BORDER = {
  SYS: "border-[#7ca5c9]",
  REASONING: "border-[#7eb8d4]",
  TOOL: "border-emerald-400",
  RESULT: "border-amber-400",
  ALERT: "border-red-400",
  COMPLETE: "border-[#00e5ff]",
};

export const SCENARIOS = {
  "A — Standard": { n_drones: 5, n_survivors: 8, seed: 42 },
  "B — Drone Failure": { n_drones: 4, n_survivors: 8, seed: 77 },
  "C — High Risk": { n_drones: 5, n_survivors: 8, seed: 55 },
  "D — Dynamic Fleet": { n_drones: 6, n_survivors: 10, seed: 33 },
};

export const LEGEND_COLORS = [
  ["#040d18", "UNVISITED"],
  ["#2d0a00", "HAZARD"],
  ["#0a2e1a", "SCANNED"],
  ["#00e5ff", "DRONE (ACTIVE)"],
  ["#ffb703", "DRONE (CHARGING)"],
  ["#7c5200", "SURVIVOR ✓"],
];
