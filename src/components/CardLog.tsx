import { LOG_BORDER, LOG_COLORS } from "../constants/constants";

type CardLogProps = {
  index: number;
  id: number;
  time: string;
  msg: string;
  type: string;
};

const CardLog = ({ index, id, time, msg, type }: CardLogProps) => {
  return (
    <div
      key={id}
      className={`flex gap-2 mb-1 pl-2 border-l-2 py-0.5 ${index === 0 ? LOG_BORDER[type as keyof typeof LOG_BORDER] : "border-[#0f3460]"}`}
      style={{ opacity: Math.max(0.3, 1 - index * 0.04) }}
    >
      <span className="font-share-tech-mono text-[8.5px] text-[#0f3460] shrink-0 mt-px">
        [{time}s]
      </span>
      <span
        className={`font-share-tech-mono text-[8.5px] leading-relaxed ${index === 0 ? LOG_COLORS[type as keyof typeof LOG_COLORS] : "text-[#7ca5c9]"}`}
      >
        {msg}
      </span>
    </div>
  );
};

export default CardLog;
