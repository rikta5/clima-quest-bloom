import { Lock, CheckCircle2 } from "lucide-react";

interface NodeCircleProps {
  number: number;
  status: "locked" | "active" | "completed";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export const NodeCircle = ({ number, status, size = "md", onClick }: NodeCircleProps) => {
  const sizeClasses = {
    sm: "w-12 h-12 text-sm",
    md: "w-16 h-16 text-base",
    lg: "w-20 h-20 text-lg"
  };

  const statusStyles = {
    locked: "bg-muted text-muted-foreground border-border cursor-not-allowed",
    active: "bg-primary text-primary-foreground border-primary shadow-eco-lg cursor-pointer hover:scale-110",
    completed: "bg-accent text-accent-foreground border-accent cursor-pointer hover:scale-105"
  };

  const iconSize = {
    sm: 16,
    md: 20,
    lg: 24
  };

  return (
    <button
      onClick={status !== "locked" ? onClick : undefined}
      disabled={status === "locked"}
      className={`
        ${sizeClasses[size]}
        ${statusStyles[status]}
        rounded-full
        border-4
        flex items-center justify-center
        font-bold
        transition-all
        duration-300
      `}
    >
      {status === "locked" && <Lock size={iconSize[size]} />}
      {status === "active" && <span>{number}</span>}
      {status === "completed" && <CheckCircle2 size={iconSize[size]} className="fill-current" />}
    </button>
  );
};
