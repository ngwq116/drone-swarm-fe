import { useState } from "react";

type ModalConfigProps = {
  setConfigOpen: (open: boolean) => void;
  backupCount: number;
  backupDeployStep: number;
  applyAndReset: (config: {
    droneCount: number;
    gridSize: number;
    targetCount: number;
    backupCount: number;
    backupDeployStep: number;
  }) => void;
};

const ModalConfig = ({
  setConfigOpen,
  backupCount,
  backupDeployStep,
  applyAndReset,
}: ModalConfigProps) => {
  const [draftConfig, setDraftConfig] = useState({
    droneCount: 5,
    gridSize: 20,
    targetCount: 8,
    backupCount: backupCount,
    backupDeployStep: backupDeployStep,
  });

  const handleApplyReset = () => {
    applyAndReset(draftConfig);
    setConfigOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setConfigOpen(false)}
      />

      {/* Modal */}
      <div className="relative bg-[#0C1E38] border border-[#0f3460] rounded-sm shadow-[0_0_40px_rgba(0,229,255,0.1)] w-full max-w-md mx-4">
        {/* Top accent bar */}
        <div className="h-0.5 bg-linear-to-r from-transparent via-[#00e5ff] to-transparent" />

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-[#0f3460]">
          <span className="text-[#00e5ff] text-base">⚙</span>
          <div>
            <p className="font-share-tech-mono text-[9px] text-[#7ca5c9] tracking-widest">
              SWARMSAR — MISSION CONTROL
            </p>
            <p className="font-share-tech-mono text-[13px] text-[#00e5ff] font-bold tracking-widest">
              MISSION CONFIGURATION
            </p>
          </div>
          <button
            onClick={() => setConfigOpen(false)}
            className="ml-auto text-[#7ca5c9] hover:text-white font-share-tech-mono text-[14px] cursor-pointer transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 flex flex-col gap-5">
          {/* Drone Count */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-share-tech-mono text-[11px] text-[#7ca5c9] tracking-widest">
                DRONE COUNT
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.droneCount}
              </span>
            </div>
            <input
              type="range"
              min={2}
              max={10}
              step={1}
              value={draftConfig.droneCount}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  droneCount: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                2
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                10
              </span>
            </div>
          </div>

          {/* Grid Size */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-share-tech-mono text-[11px] text-[#7ca5c9] tracking-widest">
                GRID SIZE
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.gridSize}×{draftConfig.gridSize}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={30}
              step={5}
              value={draftConfig.gridSize}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  gridSize: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                10×10
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                30×30
              </span>
            </div>
          </div>

          {/* Target Count */}
          <div>
            <div className="flex justify-between mb-2">
              {/* <label className="font-share-tech-mono text-[9px] text-[#7ca5c9] tracking-widest">
                {cfg.targetLabel.toUpperCase()} COUNT
              </label> */}
              <label className="font-share-tech-mono text-[11px] text-[#7ca5c9] tracking-widest">
                TARGET COUNT
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.targetCount}
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={20}
              step={1}
              value={draftConfig.targetCount}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  targetCount: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                1
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                20
              </span>
            </div>
          </div>

          {/* Hazard Density */}
          {/* <div>
            <div className="flex justify-between mb-2">
              <label className="font-share-tech-mono text-[9px] text-[#7ca5c9] tracking-widest">
                HAZARD DENSITY
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.hazardDensity}
              </span>
            </div>
            <input
              type="range"
              min={0.01}
              max={0.25}
              step={0.01}
              value={draftConfig.hazardDensity}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  hazardDensity: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                0.01 (sparse)
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                0.25 (dense)
              </span>
            </div>
          </div> */}

          {/* Backup Drone Count */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-share-tech-mono text-[11px] text-[#7ca5c9] tracking-widest">
                BACKUP DRONE COUNT
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.backupCount}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={8}
              step={1}
              value={draftConfig.backupCount}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  backupCount: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                0
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                8
              </span>
            </div>
          </div>

          {/* Backup Deploy Step Count */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="font-share-tech-mono text-[11px] text-[#7ca5c9] tracking-widest">
                BACKUP DEPLOY STEP COUNT
              </label>
              <span className="font-share-tech-mono text-[13px] text-[#00e5ff] leading-none">
                {draftConfig.backupDeployStep}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={100}
              step={5}
              value={draftConfig.backupDeployStep}
              onChange={(e) =>
                setDraftConfig((p) => ({
                  ...p,
                  backupDeployStep: Number(e.target.value),
                }))
              }
              className="w-full h-1 accent-[#00e5ff] cursor-pointer"
            />
            <div className="flex justify-between mt-1">
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                10
              </span>
              <span className="font-share-tech-mono text-[8px] text-[#7ca5c9]/40">
                100
              </span>
            </div>
          </div>

          {/* Summary preview */}
          <div className="px-3 py-2.5 bg-[#081428] border border-[#0f3460] rounded-sm">
            <p className="font-share-tech-mono text-[11px] text-[#7ca5c9]/60 tracking-widest mb-1.5">
              CONFIGURATION PREVIEW
            </p>
            <div className="font-share-tech-mono text-[10px] text-[#7ca5c9] leading-relaxed">
              <span className="text-[#00e5ff]">drones:</span>{" "}
              {draftConfig.droneCount} &nbsp;
              <span className="text-[#00e5ff]">backup:</span>{" "}
              {draftConfig.backupCount} &nbsp;
              <span className="text-[#00e5ff]">deploy@:</span>{" "}
              {draftConfig.backupDeployStep} &nbsp;
              <span className="text-[#00e5ff]">grid:</span>{" "}
              {draftConfig.gridSize}×{draftConfig.gridSize} &nbsp;
              <span className="text-[#00e5ff]">targets:</span>{" "}
              {draftConfig.targetCount} &nbsp;
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-2 px-5 pb-5">
          <button
            onClick={() => setConfigOpen(false)}
            className="flex-1 py-2 bg-transparent hover:bg-[#0f3460]/50 border border-[#0f3460] text-[#7ca5c9] font-share-tech-mono text-[10px] tracking-widest rounded-sm transition-all cursor-pointer"
          >
            CANCEL
          </button>
          <button
            onClick={handleApplyReset}
            className="flex-1 py-2 bg-[#00e5ff]/10 hover:bg-[#00e5ff]/20 border border-[#00e5ff]/50 hover:border-[#00e5ff] text-[#00e5ff] font-share-tech-mono text-[10px] tracking-widest rounded-sm transition-all cursor-pointer"
          >
            APPLY & RESET
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfig;
