type CardFleetStatusProps = {
  id: string;
  batch: 1 | 2;
  borderColor: string | undefined;
  statusColor: string | undefined;
  battCls: string;
  icon: string | undefined;
  battery: number;
  status: string;
  x: number;
  y: number;
  found: number;
  moves: number;
};

const CardFleetStatus = ({
  id,
  batch,
  borderColor,
  statusColor,
  battCls,
  icon,
  battery,
  status,
  x,
  y,
  found,
  moves,
}: CardFleetStatusProps) => {
  return (
    <div
      key={id}
      className="flex items-center gap-2 mb-1 bg-[#0c1e38] px-2 py-1 border border-[#0f3460]"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <span className="font-share-tech-mono text-[10px] text-[#00e5ff] w-14 shrink-0">
        {batch === 2 && <span className="text-[#ff9500]">[B2] </span>}
        {id.replace("drone_", "UAV-").replace("backup_", "BKP-")}
      </span>
      <span
        className={`font-share-tech-mono text-[9px] w-16 shrink-0 ${statusColor}`}
      >
        {icon} {status}
      </span>
      <BattBar pct={battery} />
      <span
        className={`font-share-tech-mono text-[10px] w-8 text-right shrink-0 ${battCls}`}
      >
        {Math.round(battery)}%
      </span>
      <span className="font-share-tech-mono text-[9px] text-[#0f3460] w-10 text-right shrink-0">
        ({x},{y})
      </span>
      <span className="font-share-tech-mono text-[9px] text-[#7ca5c9] shrink-0">
        {found}✓ {moves}mv
      </span>
    </div>
  );
};

export default CardFleetStatus;

const BattBar = ({ pct }: { pct: number }) => {
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
};
