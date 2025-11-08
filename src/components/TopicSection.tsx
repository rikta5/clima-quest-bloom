import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LevelNode } from "./LevelNode";
import { Topic } from "@/config/levelsConfig";
import { useNavigate } from "react-router-dom";

interface TopicSectionProps {
  topic: Topic;
}

export const TopicSection = ({ topic }: TopicSectionProps) => {
  const navigate = useNavigate();

  const handleNodeClick = (levelId: number) => {
    navigate(`/levels/${levelId}`);
  };

  // Calculate grid positions for horizontal layout
  const getNodePosition = (index: number) => {
    return {
      x: index,
      y: 0
    };
  };

  const completedCount = topic.levels.filter(l => l.status === "completed").length;
  const progressPercentage = (completedCount / topic.levels.length) * 100;

  return (
    <Card className="p-8 space-y-6">
      {/* Topic Header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-foreground">{topic.name}</h2>
            <p className="text-muted-foreground">{topic.description}</p>
          </div>
          <Badge variant="outline" className="text-sm px-4 py-2">
            {completedCount} / {topic.levels.length} Complete
          </Badge>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Levels Path */}
      <div className="relative overflow-x-auto py-8">
        <div className="min-w-fit mx-auto px-4" style={{ width: `${topic.levels.length * 150}px` }}>
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
            {topic.levels.map((_, index) => {
              if (index === topic.levels.length - 1) return null;
              
              const current = getNodePosition(index);
              const next = getNodePosition(index + 1);
              
              const x1 = current.x * 150 + 75;
              const y1 = 60;
              const x2 = next.x * 150 + 75;
              const y2 = 60;
              
              return (
                <line
                  key={index}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="hsl(var(--border))"
                  strokeWidth="3"
                  strokeDasharray="8,4"
                />
              );
            })}
          </svg>

          {/* Level Nodes */}
          <div className="relative flex items-center gap-8">
            {topic.levels.map((level, index) => {
              const pos = getNodePosition(index);
              return (
                <div
                  key={level.id}
                  className="flex-shrink-0"
                >
                  <LevelNode
                    id={level.id}
                    title={level.title}
                    status={level.status}
                    onClick={() => handleNodeClick(level.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
};
