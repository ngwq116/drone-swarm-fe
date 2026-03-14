import { useState, useEffect, useRef, useCallback } from "react";
import TitleSection from "./components/TitleSection";
import MetricCard from "./components/MetricCard";
import { LOG_BORDER, LOG_COLORS } from "./constants/constants";
import Button from "./components/Button";
import cn from "./utils/ClassMerge";

const GRID = 20;
const TOTAL = GRID * GRID;

const SCENARIOS = {
  "A — Standard": { n_drones: 5, n_survivors: 8, seed: 42 },
  "B — Drone Failure": { n_drones: 4, n_survivors: 8, seed: 77 },
  "C — High Risk": { n_drones: 5, n_survivors: 8, seed: 55 },
  "D — Dynamic Fleet": { n_drones: 6, n_survivors: 10, seed: 33 },
};

const SECTORS = {
  NW: [0, 10, 10, 20],
  NE: [10, 10, 20, 20],
  SW: [0, 0, 10, 10],
  SE: [10, 0, 20, 10],
  CENTRE: [7, 7, 13, 13],
};

function seededRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

function initSim({ n_drones = 5, n_survivors = 8, seed = 42 } = {}) {
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

const WP_CACHE = {};
function getWaypoints(sector) {
  if (!WP_CACHE[sector]) {
    const [x0, y0, x1, y1] = SECTORS[sector];
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
    WP_CACHE[sector] = wps;
  }
  return WP_CACHE[sector];
}

function stepSim(prev, pushLog) {
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

function downloadLog(logs, scenario, step) {
  const header = [
    "SwarmSAR Mission Log",
    `Scenario : ${scenario}`,
    `Sim steps: ${step}`,
    `Exported : ${new Date().toISOString()}`,
    "=".repeat(50),
    "",
  ].join("\n");
  const body = [...logs]
    .reverse()
    .map((e) => `[${e.t}s] [${e.type.padEnd(9)}] ${e.msg}`)
    .join("\n");
  const a = Object.assign(document.createElement("a"), {
    href: URL.createObjectURL(
      new Blob([header + body], { type: "text/plain" }),
    ),
    download: `swarmsar_log_${scenario}_step${step}.txt`,
  });
  a.click();
  URL.revokeObjectURL(a.href);
}

function BattBar({ pct }) {
  const color =
    pct > 50 ? "bg-emerald-400" : pct > 25 ? "bg-amber-400" : "bg-red-500";
  return (
    <div className="flex-1 h-[5px] bg-[#0f2030] rounded-sm overflow-hidden min-w-[50px]">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function cellBg(cell, drones) {
  const drone = drones.find(
    (d) => d.x === cell.x && d.y === cell.y && d.status !== "FAILED",
  );
  if (drone) return drone.status === "CHARGING" ? "#ffb703" : "#00e5ff";
  if (cell.found) return "#7c5200";
  if (cell.hazard) return "#2d0a00";
  if (cell.visited) return "#0a2e1a";
  return "#0c1e38";
}

export default function App() {
  const [sim, setSim] = useState(() => initSim());
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);
  const [scenario, setScenario] = useState("A — Standard");
  const [elapsed, setElapsed] = useState(0);
  const [droneCount, setDroneCount] = useState(5);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(Date.now());
  const logRef = useRef(null);

  const pushLog = useCallback((type, msg) => {
    const t = ((Date.now() - startRef.current) / 1000).toFixed(1);
    setLogs((p) => [{ type, msg, t, id: Math.random() }, ...p.slice(0, 79)]);
  }, []);

  const doStep = useCallback(
    () => setSim((p) => stepSim(p, pushLog)),
    [pushLog],
  );

  function loadScenario(name, overrideDrones) {
    clearInterval(intervalRef.current);
    setRunning(false);
    const cfg = { ...SCENARIOS[name], n_drones: overrideDrones ?? droneCount };
    setSim(initSim(cfg));
    setLogs([]);
    startRef.current = Date.now();
    setElapsed(0);
    setScenario(name);
    setTimeout(() => {
      pushLog("SYS", "SwarmSAR Mission Control online");
      pushLog(
        "SYS",
        `Loaded: ${name} — ${cfg.n_drones} UAVs, ${cfg.n_survivors} survivors`,
      );
      pushLog(
        "REASONING",
        "[REASONING] Calling get_active_drones() to discover fleet...",
      );
      pushLog("TOOL", `→ get_active_drones() — ${cfg.n_drones} UAVs detected`);
      pushLog(
        "REASONING",
        "[REASONING] Assessing sector risk map before mission assignment...",
      );
      pushLog(
        "TOOL",
        "→ get_risk_map(SE) → avg_risk: 0.71 AVOID — routing around hazard cluster",
      );
      pushLog(
        "RESULT",
        "Mission plan: sectors assigned, boustrophedon sweep initialised",
      );
    }, 50);
  }

  function toggleRun() {
    if (running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(doStep, 500);
    }
  }

  useEffect(() => {
    loadScenario("A — Standard", 5);
    timerRef.current = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      1000,
    );
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [logs]);
  useEffect(() => {
    if (sim.complete && running) {
      clearInterval(intervalRef.current);
      setRunning(false);
    }
  }, [sim.complete]);

  const cells = sim.cells.flat();
  const visited = cells.filter((c) => c.visited).length;
  const coverage = Math.round((visited / TOTAL) * 100);
  const activeCount = sim.drones.filter((d) => d.status === "ACTIVE").length;
  const chargingCount = sim.drones.filter(
    (d) => d.status === "CHARGING",
  ).length;
  const failedCount = sim.drones.filter((d) => d.status === "FAILED").length;
  const avgBatt = sim.drones.length
    ? Math.round(
        sim.drones.reduce((s, d) => s + d.battery, 0) / sim.drones.length,
      )
    : 0;
  const battAccent =
    avgBatt > 50
      ? "border-t-emerald-400"
      : avgBatt > 25
        ? "border-t-amber-400"
        : "border-t-red-500";
  const battColor =
    avgBatt > 50
      ? "text-emerald-400"
      : avgBatt > 25
        ? "text-amber-400"
        : "text-red-400";
  const criticals = sim.drones.filter(
    (d) => d.status === "ACTIVE" && d.battery < 25,
  );
  const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
  const ss = String(elapsed % 60).padStart(2, "0");

  return (
    <div className="flex h-screen bg-[#040d18] font-['Barlow'] text-[#e0f0ff] overflow-hidden">
      {/* TODO: Put this link to index.css file */}
      <link
        href="https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Barlow:wght@300;400;600&family=Barlow+Condensed:wght@400;700&display=swap"
        rel="stylesheet"
      />

      {/* ── SIDEBAR ── */}
      <div className="w-[210px] shrink-0 bg-[#081428] border-r border-[#0f3460] flex flex-col overflow-hidden">
        {/* Logo */}
        <div className="px-3.5 pt-3.5 pb-2.5 border-b border-[#0f3460]">
          <div className="font-['Barlow_Condensed'] text-base font-bold tracking-[3px] text-[#00e5ff]">
            ⬡ SWARMSAR
          </div>
          <div className="font-['Share_Tech_Mono'] text-[9px] text-[#7ca5c9] tracking-[1px] mt-0.5">
            MISSION CONTROL v1.0
          </div>
          <div className="font-['Share_Tech_Mono'] text-[9px] text-[#7ca5c9] text-left mt-2">
            <span
              className={sim.complete ? "text-[#00e5ff]" : "text-emerald-400"}
            >
              {sim.complete ? "✦ MISSION COMPLETE" : "● MISSION ACTIVE"}
            </span>
          </div>
        </div>

        {/* Drone count */}
        {/* TODO: To put into config pop up instead */}
        {/* <div className="px-2.5 pt-2.5 pb-2 border-b border-[#0f3460]">
          <div className="font-['Barlow_Condensed'] text-[9px] text-[#7ca5c9] tracking-widest mb-2 pl-0.5">
            DRONE COUNT
          </div>
          <div className="flex items-center gap-2 px-1">
            <input
              type="range"
              min={2}
              max={8}
              step={1}
              value={droneCount}
              onChange={(e) => setDroneCount(Number(e.target.value))}
              className="flex-1 h-1 accent-[#00e5ff] cursor-pointer"
            />
            <span className="font-['Share_Tech_Mono'] text-[13px] text-[#00e5ff] w-4 text-right">
              {droneCount}
            </span>
          </div>
        </div> */}

        {/* Scenarios */}
        <div className="px-2.5 pt-2.5 pb-1.5 border-b border-[#0f3460]">
          <div className="font-['Barlow_Condensed'] text-[9px] text-[#7ca5c9] tracking-widest mb-1.5 pl-0.5">
            SCENARIO
          </div>
          {Object.keys(SCENARIOS).map((name) => (
            <button
              key={name}
              onClick={() => loadScenario(name)}
              className={`w-full text-left border-none py-1.5 px-2 cursor-pointer text-[9px] font-['Share_Tech_Mono'] block mb-0.5 rounded-r transition-all duration-150
                ${
                  scenario === name
                    ? "bg-[#00e5ff18] border-l-[3px] border-l-[#00e5ff] text-[#00e5ff]"
                    : "bg-transparent border-l-[3px] border-l-transparent text-[#7ca5c9] hover:text-[#e0f0ff]"
                }`}
            >
              {name}
            </button>
          ))}
        </div>

        {/* Controls */}
        <div className="px-2.5 pt-2.5 pb-1.5 border-b border-[#0f3460]">
          <div className="font-['Barlow_Condensed'] text-[9px] text-[#7ca5c9] tracking-widest mb-1.5 pl-0.5">
            CONTROLS
          </div>
          <Button
            label={running ? "■  PAUSE" : "▶  RUN"}
            handleClick={toggleRun}
            className={`w-full py-[7px] mb-1.5 text-[11px] font-bold ${
              running
                ? "bg-red-500/10 border-red-500 text-red-400 hover:bg-red-500/20"
                : "bg-[#00e5ff1a] border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff30]"
            }`}
          />
          <div className="flex gap-1">
            {[
              ["STEP", doStep],
              [
                "×10",
                () => {
                  for (let i = 0; i < 10; i++)
                    setSim((p) => stepSim(p, pushLog));
                },
              ],
            ].map(([lbl, fn]) => (
              <Button
                key={lbl as string}
                label={lbl as string}
                handleClick={fn as () => void}
                className="flex-1 py-[5px]"
              />
            ))}
          </div>
        </div>

        {/* Domain config */}
        <div className="px-2.5 py-2 border-t border-[#0f3460] bg-[#040d18] shrink-0">
          <div className="font-['Barlow_Condensed'] text-[8px] text-[#7ca5c9] tracking-wide mb-1">
            DOMAIN CONFIG
          </div>
          <div className="font-['Share_Tech_Mono'] text-[8.5px] text-[#7ca5c9] leading-relaxed">
            <span className="text-[#00e5ff]">agent:</span> Rescue Drone
            <br />
            <span className="text-[#00e5ff]">target:</span> Survivor
            <br />
            <span className="text-[#00e5ff]">hazard_dens:</span> 0.08
            <br />
            <span className="text-[#00e5ff]">grid:</span> 20×20
          </div>
        </div>

        {/* KPIs */}
        <div className="px-3 py-2.5 flex-1 overflow-hidden">
          <div className="font-['Barlow_Condensed'] text-[9px] text-[#7ca5c9] tracking-widest mb-2">
            MISSION KPIs
          </div>
          {[
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
            // { label: "SIM STEP", value: `${sim.step}`, cls: "text-[#7ca5c9]" },
            // { label: "WALL TIME", value: `${mm}:${ss}`, cls: "text-[#7ca5c9]" },
          ].map((k) => (
            <div key={k.label} className="mb-2.5">
              <div className="font-['Barlow_Condensed'] text-[8px] text-[#7ca5c9] tracking-wide mb-0.5">
                {k.label}
              </div>
              <div
                className={`font-['Share_Tech_Mono'] text-xl leading-none ${k.cls}`}
              >
                {k.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Alert banners */}
        {/* TODO: Alert Pop Up */}
        {criticals.length > 0 && (
          <div className="px-4 py-1.5 bg-red-500/10 border-b border-red-500 font-['Share_Tech_Mono'] text-[11px] text-red-400 shrink-0">
            ⚠ CRITICAL BATTERY — {criticals.map((d) => d.id).join(", ")} —
            RECALL IMMEDIATELY
          </div>
        )}
        {sim.complete && (
          <div className="px-4 py-1.5 bg-[#00e5ff0d] border-b border-[#00e5ff] font-['Share_Tech_Mono'] text-[11px] text-[#00e5ff] shrink-0">
            ✦ MISSION COMPLETE — All {sim.totalSurvivors} survivors located in{" "}
            {sim.step} simulation steps
          </div>
        )}
        {/* Metrics row */}
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
        {/* Grid + right panels */}
        <div className="flex-1 flex overflow-hidden px-3.5 pb-2.5 pt-0 gap-3">
          {/* Grid */}
          <div className="shrink-0 flex flex-col">
            <TitleSection label="DISASTER ZONE — LIVE GRID VIEW" />
            {/* Legend */}
            <div className="flex gap-2.5 mb-1.5 font-['Share_Tech_Mono'] text-[8.5px] text-[#7ca5c9] flex-wrap">
              {[
                ["#040d18", "UNVISITED"],
                ["#2d0a00", "HAZARD"],
                ["#0a2e1a", "SCANNED"],
                ["#00e5ff", "DRONE (ACTIVE)"],
                ["#ffb703", "DRONE (CHARGING)"],
                ["#7c5200", "SURVIVOR ✓"],
              ].map(([bg, lbl]) => (
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
              {sim.cells.flat().map((cell) => {
                const drone = sim.drones.find(
                  (d) =>
                    d.x === cell.x && d.y === cell.y && d.status !== "FAILED",
                );
                return (
                  <div
                    key={`${cell.x}-${cell.y}`}
                    className="w-6 h-6 flex items-center justify-center text-[7px] transition-colors duration-200"
                    style={{
                      background: cellBg(cell, sim.drones),
                      outline: drone
                        ? `1px solid ${drone.status === "CHARGING" ? "#ffb703" : "#00e5ff"}`
                        : "none",
                    }}
                  >
                    {drone ? (
                      <span
                        style={{
                          color:
                            drone.status === "CHARGING" ? "#000" : "#003355",
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

          {/* Fleet + Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fleet */}
            <div className="shrink-0 pt-1">
              <TitleSection label="FLEET STATUS" />
              {sim.drones.map((d) => {
                const borderColor = {
                  ACTIVE: "#2ed573",
                  CHARGING: "#ffb703",
                  FAILED: "#ff4757",
                }[d.status];
                const statusColor = {
                  ACTIVE: "text-emerald-400",
                  CHARGING: "text-amber-400",
                  FAILED: "text-red-400",
                }[d.status];
                const icon = { ACTIVE: "●", CHARGING: "⚡", FAILED: "✗" }[
                  d.status
                ];
                const battCls =
                  d.battery > 50
                    ? "text-emerald-400"
                    : d.battery > 25
                      ? "text-amber-400"
                      : "text-red-400";
                return (
                  <div
                    key={d.id}
                    className="flex items-center gap-2 mb-1 bg-[#0c1e38] px-2 py-1 border border-[#0f3460]"
                    style={{ borderLeft: `3px solid ${borderColor}` }}
                  >
                    <span className="font-['Share_Tech_Mono'] text-[9px] text-[#00e5ff] w-14 shrink-0">
                      {d.id.replace("drone_", "UAV-")}
                    </span>
                    <span
                      className={`font-['Share_Tech_Mono'] text-[8px] w-16 shrink-0 ${statusColor}`}
                    >
                      {icon} {d.status}
                    </span>
                    <BattBar pct={d.battery} />
                    <span
                      className={`font-['Share_Tech_Mono'] text-[9px] w-8 text-right shrink-0 ${battCls}`}
                    >
                      {Math.round(d.battery)}%
                    </span>
                    <span className="font-['Share_Tech_Mono'] text-[8px] text-[#0f3460] w-10 text-right shrink-0">
                      ({d.x},{d.y})
                    </span>
                    <span className="font-['Share_Tech_Mono'] text-[8px] text-[#7ca5c9] shrink-0">
                      {d.found}✓ {d.moves}mv
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Log */}
            <div className="flex-1 flex flex-col overflow-hidden mt-2">
              <div className="flex items-start justify-between mb-1.5 shrink-0">
                <TitleSection label="MISSION LOG - AGENT REASONING" />
                <Button
                  label="DOWNLOAD LOG"
                  handleClick={() => downloadLog(logs, scenario, sim.step)}
                />
              </div>
              <div
                ref={logRef}
                className="flex-1 overflow-y-auto bg-[#081428] border border-[#0f3460] px-2.5 py-2 rounded-sm"
              >
                {logs.map((log, i) => (
                  <div
                    key={log.id}
                    className={`flex gap-2 mb-1 pl-2 border-l-2 py-0.5 ${i === 0 ? LOG_BORDER[log.type as keyof typeof LOG_BORDER] : "border-[#0f3460]"}`}
                    style={{ opacity: Math.max(0.3, 1 - i * 0.04) }}
                  >
                    <span className="font-['Share_Tech_Mono'] text-[8.5px] text-[#0f3460] shrink-0 mt-px">
                      [{log.t}s]
                    </span>
                    <span
                      className={`font-['Share_Tech_Mono'] text-[8.5px] leading-relaxed ${i === 0 ? LOG_COLORS[log.type] : "text-[#7ca5c9]"}`}
                    >
                      {log.msg}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
