import { useState, useEffect, useRef, useCallback } from "react";
import { type TLogs } from "./types/types";
import ModalAlert from "./components/ModalAlert";
import MissionLog from "./containers/MissionLog";
import { SCENARIOS, TOTAL } from "./constants/constants";
import FleetStatus from "./containers/FleetStatus";
import GridView from "./containers/GridView";
import MetricsRow from "./containers/MetricsRow";
import MissionKPIs from "./containers/MissionKPIs";
import Scenarios from "./containers/Scenarios";
import { initSim, stepSim } from "./utils/Functions";
import Controls from "./containers/Controls";
import LogoPanel from "./containers/LogoPanel";
import ModalConfig from "./components/ModalConfig";
import DomainConfig from "./containers/DomainConfig";

export default function App() {
  const [sim, setSim] = useState(() => initSim());
  const [logs, setLogs] = useState<TLogs[]>([]);
  const [running, setRunning] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [scenario, setScenario] =
    useState<keyof typeof SCENARIOS>("A — Standard");
  const [elapsed, setElapsed] = useState(0);
  const [droneCount, setDroneCount] = useState(5);
  const [alertDismissed, setAlertDismissed] = useState(false);

  const intervalRef = useRef<number | null>(null);
  const timerRef = useRef<number | null>(null);

  const [gridSize, setGridSize] = useState(20);
  const [backupCount, setBackupCount] = useState(2);
  const [backupDeployStep, setBackupDeployStep] = useState(10);
  const [targetCount, setTargetCount] = useState(8);

  // eslint-disable-next-line react-hooks/purity
  const startRef = useRef<number>(Date.now());
  const logRef = useRef<HTMLDivElement | null>(null);

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

  const pushLog = useCallback((type: string, msg: string) => {
    const t = ((Date.now() - startRef.current) / 1000).toFixed(1);
    setLogs((p) => [
      { type, msg, time: t, id: Math.random() },
      ...p.slice(0, 79),
    ]);
  }, []);

  const doStep = useCallback(
    () => setSim((p) => stepSim(p, pushLog)),
    [pushLog],
  );

  const loadScenario = useCallback(
    (name: string, overrideDrones?: number) => {
      clearInterval(intervalRef.current ?? undefined);
      setRunning(false);
      const cfg = {
        ...SCENARIOS[name as keyof typeof SCENARIOS],
        n_drones: overrideDrones ?? droneCount,
        n_survivors: targetCount,
        backup_count: backupCount,
        backup_deploy_step: backupDeployStep,
      };
      setSim(initSim(cfg));
      setLogs([]);
      startRef.current = Date.now();
      setElapsed(0);
      setScenario(name as keyof typeof SCENARIOS);
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
        pushLog(
          "TOOL",
          `→ get_active_drones() — ${cfg.n_drones} UAVs detected`,
        );
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
    },
    [backupCount, backupDeployStep, droneCount, targetCount, pushLog],
  );

  const applyAndReset = useCallback(
    (config: {
      droneCount: number;
      gridSize: number;
      targetCount: number;
      backupCount: number;
      backupDeployStep: number;
    }) => {
      setDroneCount(config.droneCount);
      setGridSize(config.gridSize);
      setTargetCount(config.targetCount);
      setBackupCount(config.backupCount);
      setBackupDeployStep(config.backupDeployStep);
      clearInterval(intervalRef.current ?? undefined);
      setRunning(false);
      const cfg = {
        ...SCENARIOS[scenario as keyof typeof SCENARIOS],
        n_drones: config.droneCount,
        n_survivors: config.targetCount,
        backup_count: config.backupCount,
        backup_deploy_step: config.backupDeployStep,
      };
      setSim(initSim(cfg));
      setLogs([]);
      startRef.current = Date.now();
      setElapsed(0);
      setTimeout(() => {
        pushLog("SYS", "SwarmSAR Mission Control online");
        pushLog(
          "SYS",
          `Loaded: ${scenario} — ${cfg.n_drones} UAVs, ${cfg.n_survivors} survivors`,
        );
        pushLog(
          "REASONING",
          "[REASONING] Calling get_active_drones() to discover fleet...",
        );
        pushLog(
          "TOOL",
          `→ get_active_drones() — ${cfg.n_drones} UAVs detected`,
        );
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
    },
    [scenario, pushLog],
  );

  const toggleRun = () => {
    if (running) {
      clearInterval(intervalRef.current ?? undefined);
      setRunning(false);
    } else {
      setRunning(true);
      intervalRef.current = setInterval(doStep, 1000);
    }
  };

  const handleConfig = () => {
    setConfigOpen(true);
  };

  useEffect(() => {
    loadScenario("A — Standard", 5);
    timerRef.current = setInterval(
      () => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)),
      1000,
    );
    return () => {
      clearInterval(intervalRef.current ?? undefined);
      clearInterval(timerRef.current ?? undefined);
    };
  }, []);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = 0;
  }, [logs]);
  useEffect(() => {
    if (sim.complete && running) {
      clearInterval(intervalRef.current ?? undefined);
      setRunning(false);
    }
  }, [sim.complete]);

  // Reset dismissed state whenever new criticals appear
  useEffect(() => {
    if (criticals.length > 0) setAlertDismissed(false);
  }, [criticals.length]);

  return (
    <div className="flex h-screen bg-[#040d18] font-['Barlow'] text-[#e0f0ff] overflow-hidden">
      {/* ── SIDEBAR ── */}
      <div className="w-[210px] shrink-0 bg-[#081428] border-r border-[#0f3460] flex flex-col overflow-hidden">
        {/* Logo */}
        <LogoPanel sim={sim} />

        {/* Scenarios */}
        <Scenarios loadScenario={loadScenario} scenario={scenario} />

        {/* Controls */}
        <Controls
          running={running}
          toggleRun={toggleRun}
          doStep={doStep}
          setSim={setSim}
          pushLog={pushLog}
          handleConfig={handleConfig}
        />
        {/* Configuration Modal (Not Functioning, Only UI) */}
        {configOpen && (
          <ModalConfig
            setConfigOpen={setConfigOpen}
            backupCount={backupCount}
            backupDeployStep={backupDeployStep}
            applyAndReset={applyAndReset}
          />
        )}

        {/* Domain config */}
        <DomainConfig gridSize={gridSize} />

        {/* KPIs */}
        <MissionKPIs
          sim={sim}
          coverage={coverage}
          activeCount={activeCount}
          avgBatt={avgBatt}
          battColor={battColor}
        />
      </div>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {criticals.length > 0 && !alertDismissed && (
          <>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

              {/* Modal */}
              <ModalAlert
                criticals={criticals}
                setAlertDismissed={setAlertDismissed}
              />
            </div>
          </>
        )}
        {sim.complete && (
          <div className="px-4 py-1.5 bg-[#00e5ff0d] border-b border-[#00e5ff] font-share-tech-mono text-[11px] text-[#00e5ff] shrink-0">
            ✦ MISSION COMPLETE — All {sim.totalSurvivors} survivors located in{" "}
            {sim.step} simulation steps
          </div>
        )}
        {/* Metrics row */}
        <MetricsRow
          sim={sim}
          mm={mm}
          ss={ss}
          coverage={coverage}
          activeCount={activeCount}
          chargingCount={chargingCount}
          failedCount={failedCount}
          avgBatt={avgBatt}
          battAccent={battAccent}
        />

        {/* Grid + right panels */}
        <div className="flex-1 flex overflow-hidden px-3.5 pb-2.5 pt-0 gap-3">
          {/* Grid */}
          <GridView cells={cells} drones={sim.drones} />

          {/* Fleet + Log */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Fleet */}
            <FleetStatus drones={sim.drones} />

            {/* Log */}
            <MissionLog logs={logs} scenario={scenario} step={sim.step} />
          </div>
        </div>
      </div>
    </div>
  );
}
