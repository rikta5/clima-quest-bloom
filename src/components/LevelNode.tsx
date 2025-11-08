import { Lock, CheckCircle2, Crown } from "lucide-react";
import { LevelStatus } from "@/config/levelsConfig";

interface LevelNodeProps {
  id: number;
  title: string;
  status: LevelStatus;
  isBonus?: boolean;
  onClick?: () => void;
}

export const LevelNode = ({ id, title, status, isBonus = false, onClick }: LevelNodeProps) => {
  const statusStyles = {
    completed: "bg-accent text-accent-foreground border-accent shadow-eco-lg",
    unlocked: "bg-secondary text-secondary-foreground border-secondary shadow-eco",
    locked: "bg-muted text-muted-foreground border-border"
  };

  const isClickable = status !== "locked";

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        className={`
          relative
          w-20 h-20
          rounded-full
          border-4
          flex items-center justify-center
          font-bold text-lg
          transition-all duration-300
          ${statusStyles[status]}
          ${isClickable ? 'cursor-pointer hover:scale-110' : 'cursor-not-allowed'}
        `}
      >
        {isBonus && <Crown className="absolute -top-3 -right-1 w-6 h-6 text-orange" />}
        
        {status === "locked" && <Lock size={24} />}
        {status === "unlocked" && <span>{id}</span>}
        {status === "completed" && <CheckCircle2 size={28} className="fill-current" />}
      </button>
      
      <div className="text-center max-w-[120px]">
        <p className={`text-sm font-semibold ${status === "locked" ? "text-muted-foreground" : "text-foreground"}`}>
          {title}
        </p>
      </div>
    </div>
  );
};
