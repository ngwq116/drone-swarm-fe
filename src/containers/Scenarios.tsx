import Button from "../components/Button";
import { SCENARIOS } from "../constants/constants";

type ScenariosProps = {
  loadScenario: (name: string, overrideDrones?: number) => void;
  scenario: string;
};

const Scenarios = ({ loadScenario, scenario }: ScenariosProps) => {
  return (
    <div className="px-2.5 pt-2.5 pb-1.5 border-b border-[#0f3460]">
      <div className="font-barlow text-[9px] text-[#7ca5c9] tracking-widest mb-1.5 pl-0.5">
        SCENARIO
      </div>
      {Object.keys(SCENARIOS).map((name) => (
        <Button
          key={name}
          label={name}
          handleClick={() => loadScenario(name)}
          className={`w-full text-left border-none py-1.5 px-2 cursor-pointer text-[9px] font-share-tech-mono block mb-0.5 rounded-r transition-all duration-150
                ${
                  scenario === name
                    ? "bg-[#00e5ff18] border-l-[3px] border-l-[#00e5ff] text-[#00e5ff]"
                    : "bg-transparent border-l-[3px] border-l-transparent text-[#7ca5c9] hover:text-[#e0f0ff]"
                }`}
        />
      ))}
    </div>
  );
};

export default Scenarios;
