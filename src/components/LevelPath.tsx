import { LevelNode } from "./LevelNode";
import { Level } from "@/config/levelsConfig";
import { useNavigate } from "react-router-dom";

interface LevelPathProps {
  levels: Level[];
}

export const LevelPath = ({ levels }: LevelPathProps) => {
  const navigate = useNavigate();

  const handleNodeClick = (levelId: number) => {
    navigate(`/levels/${levelId}`);
  };

  // Calculate positions for zig-zag pattern
  const getNodePosition = (index: number) => {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const isEvenRow = row % 2 === 0;
    
    return {
      x: isEvenRow ? col : 2 - col,
      y: row
    };
  };

  return (
    <div className="relative w-full overflow-x-auto py-8">
      <div className="min-w-[600px] mx-auto" style={{ width: 'fit-content' }}>
        {/* SVG Path Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
          {levels.map((_, index) => {
            if (index === levels.length - 1) return null;
            
            const current = getNodePosition(index);
            const next = getNodePosition(index + 1);
            
            const x1 = current.x * 200 + 100;
            const y1 = current.y * 180 + 60;
            const x2 = next.x * 200 + 100;
            const y2 = next.y * 180 + 60;
            
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
        <div className="relative" style={{ height: `${Math.ceil(levels.length / 3) * 180}px` }}>
          {levels.map((level, index) => {
            const pos = getNodePosition(index);
            return (
              <div
                key={level.id}
                className="absolute"
                style={{
                  left: `${pos.x * 200 + 50}px`,
                  top: `${pos.y * 180}px`,
                  transform: 'translateX(-50%)'
                }}
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
  );
};
