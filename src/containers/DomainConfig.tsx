type DomainConfigProps = {
  gridSize: number;
};

const TitleDomainConfig = ({ label }: { label: string }) => {
  return <span className="text-[#00e5ff]">{label}:</span>;
};

const DomainConfig = ({ gridSize }: DomainConfigProps) => {
  return (
    <div className="px-2.5 py-2 border-t border-[#0f3460] bg-[#040d18] shrink-0">
      <div className="font-barlow text-[10px] text-[#7ca5c9] tracking-wide mb-1">
        DOMAIN CONFIG
      </div>
      <div className="font-share-tech-mono text-[9px] text-[#7ca5c9] leading-relaxed">
        <TitleDomainConfig label="agent" /> Rescue Drone
        <br />
        <TitleDomainConfig label="target" /> Survivor
        <br />
        <TitleDomainConfig label="hazard dens" /> 0.08
        <br />
        <TitleDomainConfig label="grid" /> {gridSize}×{gridSize}
      </div>
    </div>
  );
};

export default DomainConfig;
