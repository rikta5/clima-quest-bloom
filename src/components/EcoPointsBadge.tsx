import { Leaf } from "lucide-react";

interface EcoPointsBadgeProps {
  points: number;
  size?: "sm" | "md" | "lg";
}

export const EcoPointsBadge = ({ points, size = "md" }: EcoPointsBadgeProps) => {
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
    <div className={`inline-flex items-center gap-1.5 bg-accent text-accent-foreground rounded-full font-semibold ${sizeClasses[size]} shadow-eco transition-all hover:shadow-eco-lg hover:scale-105`}>
      <Leaf size={iconSizes[size]} className="fill-current" />
      <span>{points.toLocaleString()}</span>
    </div>
  );
};
