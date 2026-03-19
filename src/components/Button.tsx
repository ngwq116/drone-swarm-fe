import React from "react";
import cn from "../utils/ClassMerge";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
  handleClick: () => void;
  className?: string;
};

const Button = ({ label, handleClick, className }: ButtonProps) => {
  return (
    <button
      onClick={handleClick}
      className={cn(
        "font-barlow text-[9px] tracking-wider px-3 py-1 border border-[#0f3460] text-[#7ca5c9] rounded-sm cursor-pointer hover:border-[#7ca5c9] hover:text-[#e0f0ff]transition-all",
        className,
      )}
    >
      {label}
    </button>
  );
};

export default Button;
