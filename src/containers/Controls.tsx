import type { Dispatch, SetStateAction } from "react";
import Button from "../components/Button";
import type { TSim } from "../types/types";
import { stepSim } from "../utils/Functions";

type ControlsProps = {
  running: boolean;
  toggleRun: () => void;
  doStep: () => void;
  setSim: Dispatch<SetStateAction<TSim>>;
  pushLog: (type: string, msg: string) => void;
  handleConfig: () => void;
};

const Controls = ({
  running,
  toggleRun,
  doStep,
  setSim,
  pushLog,
  handleConfig,
}: ControlsProps) => {
  return (
    <div className="px-2.5 pt-2.5 pb-1.5 border-b border-[#0f3460]">
      <div className="font-barlow text-[9px] text-[#7ca5c9] tracking-widest mb-1.5 pl-0.5">
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
              for (let i = 0; i < 10; i++) setSim((p) => stepSim(p, pushLog));
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
      <Button
        label={"Configuration"}
        handleClick={handleConfig}
        className="py-[5px] text-[9px] tracking-wider w-full"
      />
    </div>
  );
};

export default Controls;
