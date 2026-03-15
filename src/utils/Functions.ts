import { GRID, SECTORS } from "../constants/constants";
import type { TSim } from "../types/types";

const WP_CACHE: Record<string, [number, number][]> = {};

function getWaypoints(sector: string) {
  if (!WP_CACHE[sector]) {
    const [x0, y0, x1, y1] = SECTORS[sector as keyof typeof SECTORS];
    const wps = [];
    for (let col = x0; col < x1; col += 2) {
      const rev = ((col - x0) / 2) % 2 === 1;
      for (
        let row = rev ? y1 - 1 : y0;
        rev ? row >= y0 : row < y1;
        rev ? row-- : row++
      )
        wps.push([col, row]);
    }
    WP_CACHE[sector] = wps as [number, number][];
  }
  return WP_CACHE[sector];
}

function seededRng(seed: number) {
    let s = seed;
    return () => {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      return (s >>> 0) / 0xffffffff;
    };
  }
  
 export const initSim = ({ n_drones = 5, n_survivors = 8, seed = 42 } = {}) => {
    const rng = seededRng(seed);
    const cells = Array.from({ length: GRID }, (_, y) =>
      Array.from({ length: GRID }, (_, x) => ({
        x,
        y,
        hazard: rng() < (seed === 55 ? 0.18 : 0.08),
        visited: false,
        survivor: false,
        found: false,
      })),
    );
    let placed = 0;
    while (placed < n_survivors) {
      const x = Math.floor(rng() * GRID);
      const y = Math.floor(rng() * GRID);
      if (!cells[y][x].hazard && !cells[y][x].survivor) {
        cells[y][x].survivor = true;
        placed++;
      }
    }
    const sectorKeys = ["SW", "NW", "NE", "SE", "CENTRE"];
    const drones = Array.from({ length: n_drones }, (_, i) => ({
      id: `drone_${i + 1}`,
      x: 0,
      y: 0,
      battery: Math.floor(85 + rng() * 15),
      status: "ACTIVE",
      found: 0,
      moves: 0,
      sector: sectorKeys[i % sectorKeys.length],
      wpIdx: 0,
    }));
    return {
      cells,
      drones,
      step: 0,
      totalSurvivors: n_survivors,
      foundTotal: 0,
      complete: false,
    };
  }

export const stepSim = (prev: TSim, pushLog: (type: string, msg: string) => void) => {
    const cells = prev.cells.map((row) => row.map((c) => ({ ...c })));
    let foundTotal = prev.foundTotal;
    const drones = prev.drones.map((drone) => {
      const d = { ...drone };
      if (d.status === "FAILED") return d;
      if (d.battery <= 5) {
        pushLog("ALERT", `🔴 ${d.id} battery failure at (${d.x},${d.y})`);
        return { ...d, status: "FAILED" };
      }
      if (d.status === "CHARGING") {
        const nb = Math.min(100, d.battery + 20);
        if (nb >= 80)
          pushLog("TOOL", `✅ ${d.id} recharged — back online at ${nb}%`);
        return { ...d, battery: nb, status: nb >= 80 ? "ACTIVE" : "CHARGING" };
      }
      if (d.battery < 25) {
        pushLog("ALERT", `⚠️ ${d.id} critical battery — recalling to base`);
        return { ...d, status: "CHARGING", x: 0, y: 0 };
      }
      const wps = getWaypoints(d.sector);
      const [tx, ty] = wps[d.wpIdx % wps.length];
      const ax =
        Math.abs(tx - d.x) <= 1 && Math.abs(ty - d.y) <= 1
          ? tx
          : d.x + Math.sign(tx - d.x);
      const ay =
        Math.abs(tx - d.x) <= 1 && Math.abs(ty - d.y) <= 1
          ? ty
          : d.y + Math.sign(ty - d.y);
      const cell = cells[ay]?.[ax];
      if (!cell) return d;
      cell.visited = true;
      let newFound = d.found;
      if (cell.survivor && !cell.found) {
        cell.found = true;
        cell.survivor = false;
        newFound++;
        foundTotal++;
        pushLog(
          "COMPLETE",
          `⚡ Survivor detected at (${ax},${ay}) — total: ${foundTotal}/${prev.totalSurvivors}`,
        );
      }
      return {
        ...d,
        x: ax,
        y: ay,
        battery: Math.max(0, d.battery - (cell.hazard ? 6 : 2)),
        moves: d.moves + 1,
        found: newFound,
        wpIdx: ax === tx && ay === ty ? d.wpIdx + 1 : d.wpIdx,
      };
    });
    const complete = foundTotal >= prev.totalSurvivors;
    if (complete && !prev.complete)
      pushLog(
        "COMPLETE",
        `🎯 MISSION COMPLETE — all ${prev.totalSurvivors} survivors located!`,
      );
    return {
      cells,
      drones,
      step: prev.step + 1,
      totalSurvivors: prev.totalSurvivors,
      foundTotal,
      complete,
    };
  }