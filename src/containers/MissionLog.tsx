import { useRef } from "react";
import TitleSection from "../components/TitleSection";
import Button from "../components/Button";
import CardLog from "../components/CardLog";
import type { TLogs } from "../types/types";

type MissionLogProps = {
  logs: TLogs[];
  scenario: string;
  step: number;
};

const MissionLog = ({ logs, scenario, step }: MissionLogProps) => {
  const logRef = useRef(null);

  const downloadLog = (logs: TLogs[], scenario: string, step: number) => {
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
      .map((e) => `[${e.time}s] [${e.type.padEnd(9)}] ${e.msg}`)
      .join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(
        new Blob([header + body], { type: "text/plain" }),
      ),
      download: `swarmsar_log_${scenario}_step${step}.txt`,
    });
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden mt-2">
      <div className="flex items-start justify-between mb-1.5 shrink-0">
        <TitleSection label="MISSION LOG - AGENT REASONING" />
        <Button
          label="DOWNLOAD LOG"
          handleClick={() => downloadLog(logs, scenario, step)}
        />
      </div>
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto bg-[#081428] border border-[#0f3460] px-2.5 py-2 rounded-sm"
      >
        {logs.map((log, i) => (
          <CardLog
            index={i}
            id={log.id}
            time={log.time}
            msg={log.msg}
            type={log.type}
          />
        ))}
      </div>
    </div>
  );
};

export default MissionLog;
