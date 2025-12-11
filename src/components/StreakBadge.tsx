import { Flame } from "lucide-react";

interface StreakBadgeProps {
  days: number;
  size?: "sm" | "md" | "lg";
}

export const StreakBadge = ({ days, size = "md" }: StreakBadgeProps) => {
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5",
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 18
  };

  return (
    <div className={`inline-flex items-center gap-1.5 glass text-orange rounded-full font-semibold ${sizeClasses[size]} shadow-glass transition-all duration-300 hover:shadow-eco-lg hover:scale-105`}>
      <Flame size={iconSizes[size]} className="fill-current" />
      <span>{days} day{days !== 1 ? 's' : ''}</span>
    </div>
  );
};
