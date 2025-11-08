import { useEffect, useState } from "react";
import mascotImg from "@/assets/mascot.png";
import { Loader2 } from "lucide-react";

interface LevelTransitionProps {
  onComplete: () => void;
}

export const LevelTransition = ({ onComplete }: LevelTransitionProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`
        fixed inset-0 z-50 bg-background/95 backdrop-blur-sm
        flex flex-col items-center justify-center gap-6
        transition-opacity duration-300
        ${visible ? "opacity-100" : "opacity-0"}
      `}
    >
      <div className="relative animate-bounce">
        <img 
          src={mascotImg} 
          alt="Mascot" 
          className="w-32 h-32 object-contain"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-xl font-semibold text-foreground">
          Loading next level...
        </p>
      </div>
    </div>
  );
};
