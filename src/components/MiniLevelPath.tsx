import { NodeCircle } from "./NodeCircle";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const MiniLevelPath = () => {
  const navigate = useNavigate();

  const nodes = [
    { id: 1, status: "completed" as const },
    { id: 2, status: "completed" as const },
    { id: 3, status: "active" as const, isPlay: true },
    { id: 4, status: "locked" as const },
    { id: 5, status: "locked" as const },
  ];

  return (
    <div className="relative py-8">
      {/* Connecting Line */}
      <svg className="absolute top-1/2 left-0 w-full h-1 -translate-y-1/2" preserveAspectRatio="none">
        <line
          x1="10%"
          y1="50%"
          x2="90%"
          y2="50%"
          stroke="hsl(var(--border))"
          strokeWidth="3"
          strokeDasharray="8,4"
        />
      </svg>

      {/* Nodes */}
      <div className="relative flex items-center justify-between px-4">
        {nodes.map((node) => (
          <div key={node.id} className="relative flex flex-col items-center gap-2">
            {node.isPlay ? (
              <button
                onClick={() => navigate("/levels")}
                className="w-20 h-20 bg-primary text-primary-foreground rounded-full border-4 border-primary shadow-eco-lg flex items-center justify-center font-bold text-lg hover:scale-110 transition-all duration-300 group"
              >
                <div className="flex flex-col items-center">
                  <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
                  <span className="text-xs mt-1">Play</span>
                </div>
              </button>
            ) : (
              <NodeCircle
                number={node.id}
                status={node.status}
                size="md"
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
