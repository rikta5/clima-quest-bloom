import { NodeCircle } from "./NodeCircle";
import { Play, Sparkles, Lock, CheckCircle2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { coreLevels, topics } from "@/config/levelsConfig";
import { useLevelProgress } from "@/hooks/useLevelProgress";

export const MiniLevelPath = () => {
  const navigate = useNavigate();
  const { getLevelStatus } = useLevelProgress();

  // Get first 5 levels from the config
  const levels = coreLevels.slice(0, 5);
  
  // Get levels with their dynamic status from Firebase
  const levelsWithStatus = levels.map(level => ({
    ...level,
    status: getLevelStatus(level.id)
  }));
  
  // Find the first unlocked level as the current active level
  const currentLevelIndex = levelsWithStatus.findIndex(level => level.status === "unlocked");
  const currentLevel = currentLevelIndex >= 0 ? levelsWithStatus[currentLevelIndex] : levelsWithStatus[0];
  
  // Count completed levels
  const completedCount = levelsWithStatus.filter(level => level.status === "completed").length;
  
  // Find the topic that contains the current level
  const currentTopic = topics.find(topic => 
    topic.levels.some(level => level.id === currentLevel.id)
  );

  const getNodeStatus = (index: number) => {
    const level = levelsWithStatus[index];
    if (level.status === "completed") return "completed" as const;
    if (level.status === "unlocked") return "active" as const;
    return "locked" as const;
  };

  return (
    <div className="relative">
      {/* Topic Banner */}
      <div className="mb-6 text-center space-y-2 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border border-primary/20">
        <div className="flex items-center justify-center gap-2">
          <Trophy className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            {currentTopic?.name || "Climate Fundamentals"}
          </span>
        </div>
        <h3 className="text-xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
          {currentLevel.title}
        </h3>
        <p className="text-sm text-muted-foreground">
          Level {currentLevel.id} • {completedCount} of {levels.length} completed
        </p>
      </div>

      {/* Level Path */}
      <div className="relative py-8">
        {/* Connecting Line with Progress */}
        <div className="absolute top-1/2 left-0 w-full h-2 -translate-y-1/2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
            style={{ width: `${(completedCount / levels.length) * 100}%` }}
          />
        </div>

        {/* Nodes */}
        <div className="relative flex items-center justify-between px-4">
          {levelsWithStatus.map((level, index) => {
            const status = getNodeStatus(index);
            // Only the first unlocked level gets the big Play button
            const isActive = index === currentLevelIndex && level.status === "unlocked";
            
            return (
              <div key={level.id} className="relative flex flex-col items-center gap-3 group">
                {isActive ? (
                  <button
                    onClick={() => navigate("/levels")}
                    className="relative w-20 h-20 bg-gradient-to-br from-primary to-accent text-primary-foreground rounded-full shadow-eco-lg flex items-center justify-center font-bold text-lg hover:scale-110 transition-all duration-300"
                  >
                    <div className="relative flex flex-col items-center">
                      <Play className="w-8 h-8 fill-current" />
                      <span className="text-xs mt-1">Play</span>
                    </div>
                  </button>
                ) : (
                  <div className="relative">
                    <NodeCircle
                      number={level.id}
                      status={status}
                      size="md"
                    />
                    {status === "completed" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-accent-foreground" />
                      </div>
                    )}
                    {status === "locked" && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-muted rounded-full flex items-center justify-center">
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                )}
                
                {/* Level Label */}
                <div className={`text-center space-y-1 transition-all ${isActive ? 'scale-110' : ''}`}>
                  <p className={`text-xs font-semibold ${
                    status === "completed" ? "text-accent" :
                    isActive ? "text-primary" :
                    "text-muted-foreground"
                  }`}>
                    L{level.id}
                  </p>
                  <p className={`text-[10px] max-w-[60px] line-clamp-2 ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {level.title}
                  </p>
                </div>

                {/* Sparkle effect for active level */}
                {isActive && (
                  <Sparkles className="absolute -top-2 -right-2 w-4 h-4 text-primary" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
