import cn from "../utils/ClassMerge";

type TitleSectionProps = {
  label: string;
  icon?: boolean;
  className?: string;
};

const TitleSection = ({ label, icon = true, className }: TitleSectionProps) => {
  return (
    <div
      className={cn(
        "font-barlow tracking-widest text-[#7ca5c9] mb-1.5 mt-1 uppercase",
        icon === false ? "text-[10px]" : "text-[12px]",
        className,
      )}
    >
      {icon && "▸ "} {label}
    </div>
  );
};

export default TitleSection;
