import TitleSection from "./TitleSection";

type MetricCardProps = {
  label: string;
  value: string;
  sub?: string;
  accentColor?: string;
};

const MetricCard = ({
  label,
  value,
  sub,
  accentColor = "border-t-[#00e5ff]",
}: MetricCardProps) => {
  return (
    <div
      className={`bg-[#0c1e38] border border-[#0f3460] border-t-2 ${accentColor} p-3 rounded-sm`}
    >
      <TitleSection label={label} icon={false} />
      <div
        className="font-share-tech-mono text-[22px] leading-none"
        dangerouslySetInnerHTML={{ __html: value }}
      />
      {sub && (
        <div className="font-share-tech-mono text-[10px] text-[#7ca5c9] mt-1">
          {sub}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
