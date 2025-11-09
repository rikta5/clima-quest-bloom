import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, CheckCircle2, Loader2 } from "lucide-react";
import { useTopics } from "@/hooks/useTopics";
import { useLevelProgress } from "@/hooks/useLevelProgress";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

const TopicMap = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { topics, loading: topicsLoading } = useTopics();
  const { getLevelStatus } = useLevelProgress();

  const topic = topics.find((t) => t.id === topicId);

  if (topicsLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  const nodeWidth = 150;
  const nodeHeight = 150;
  const horizontalSpacing = 250;
  const verticalSpacing = 200;

  // Separate core and bonus levels with dynamic status
  const coreLevels = useMemo(() => 
    topic?.levels.filter(l => l.type === "core").map(level => ({
      ...level,
      status: getLevelStatus(level.id)
    })) || [], 
    [topic, getLevelStatus]
  );
  
  const bonusLevels = useMemo(() => 
    topic?.levels.filter(l => l.type === "bonus").map(level => ({
      ...level,
      status: getLevelStatus(level.id)
    })) || [], 
    [topic, getLevelStatus]
  );

  // Check if all core levels are completed to unlock bonus levels
  const allCoreLevelsCompleted = useMemo(() => 
    coreLevels.every(l => l.status === "completed"),
    [coreLevels]
  );

  // Create nodes from levels
  const nodes: Node[] = useMemo(() => {
    if (!topic) return [];

    const allLevels = [...coreLevels, ...bonusLevels];

    return allLevels.map((level, index) => {
      const isBonus = level.type === "bonus";
      const bonusIndex = isBonus ? bonusLevels.indexOf(level) : -1;
      
      // Calculate position
      let xPosition: number;
      let yPosition: number;
      
      if (isBonus) {
        // Bonus levels in a row at the bottom
        const totalBonusWidth = (bonusLevels.length - 1) * horizontalSpacing;
        const startX = -totalBonusWidth / 2;
        xPosition = startX + bonusIndex * horizontalSpacing;
        yPosition = (Math.ceil(coreLevels.length / 3) + 1) * verticalSpacing;
      } else {
        // Core levels in zigzag pattern
        const row = Math.floor(index / 3);
        const col = index % 3;
        const isEvenRow = row % 2 === 0;
        xPosition = isEvenRow
          ? col * horizontalSpacing
          : (2 - col) * horizontalSpacing;
        yPosition = row * verticalSpacing;
      }

      // Determine status for bonus levels
      const effectiveStatus = isBonus && !allCoreLevelsCompleted 
        ? "locked" 
        : level.status;

      let nodeColor = "hsl(var(--muted))";
      let textColor = "hsl(var(--muted-foreground))";
      let borderColor = "hsl(var(--border))";
      let shadowStyle = "none";

      if (effectiveStatus === "completed") {
        nodeColor = "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.8) 100%)";
        textColor = "hsl(var(--accent-foreground))";
        borderColor = "hsl(var(--accent))";
        shadowStyle = "0 8px 24px hsl(var(--accent) / 0.4)";
      } else if (effectiveStatus === "unlocked") {
        nodeColor = isBonus 
          ? "linear-gradient(135deg, hsl(var(--orange)) 0%, hsl(var(--orange) / 0.7) 100%)"
          : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--accent)) 100%)";
        textColor = isBonus
          ? "white"
          : "hsl(var(--primary-foreground))";
        borderColor = isBonus 
          ? "hsl(var(--orange))"
          : "hsl(var(--primary))";
        shadowStyle = isBonus
          ? "0 8px 24px hsl(var(--orange) / 0.4)"
          : "0 8px 24px hsl(var(--primary) / 0.3)";
      }

      return {
        id: `level-${level.id}`,
        type: "default",
        position: { x: xPosition, y: yPosition },
        data: {
          label: (
            <div
              className="flex flex-col items-center justify-center p-4 cursor-pointer"
              onClick={() => {
                if (effectiveStatus !== "locked") {
                  navigate(`/levels/${level.id}`);
                }
              }}
            >
              <div className="text-center space-y-2">
                {isBonus && (
                  <div className="absolute -top-3 -right-3 w-10 h-10 bg-gradient-to-br from-orange to-orange/80 text-white rounded-full flex items-center justify-center text-lg font-bold shadow-eco-lg animate-pulse">
                    ⭐
                  </div>
                )}
                {effectiveStatus === "locked" && (
                  <Lock className="w-10 h-10 mx-auto opacity-50" />
                )}
                {effectiveStatus === "unlocked" && (
                  <div className={`w-14 h-14 rounded-full ${isBonus ? 'bg-white/20 text-white backdrop-blur' : 'bg-white/20 text-white backdrop-blur'} flex items-center justify-center font-bold text-2xl mx-auto shadow-lg border-2 border-white/30`}>
                    {level.id}
                  </div>
                )}
                {effectiveStatus === "completed" && (
                  <CheckCircle2 className="w-12 h-12 mx-auto fill-current drop-shadow-lg" />
                )}
                <p className="font-bold text-base line-clamp-2 mt-2 drop-shadow">
                  {level.title}
                </p>
              </div>
            </div>
          ),
        },
        style: {
          background: nodeColor,
          color: textColor,
          border: `4px solid ${borderColor}`,
          borderRadius: "20px",
          width: nodeWidth,
          height: nodeHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: effectiveStatus !== "locked" ? "pointer" : "not-allowed",
          boxShadow: shadowStyle,
          transition: "all 0.3s ease",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [topic, navigate, coreLevels, bonusLevels, allCoreLevelsCompleted]);

  // Create edges connecting the nodes
  const edges: Edge[] = useMemo(() => {
    if (!topic) return [];

    const edges: Edge[] = [];

    // Connect core levels
    coreLevels.slice(0, -1).forEach((level, index) => {
      edges.push({
        id: `edge-core-${index}`,
        source: `level-${coreLevels[index].id}`,
        target: `level-${coreLevels[index + 1].id}`,
        animated: coreLevels[index].status === "completed",
        style: {
          stroke: "hsl(var(--border))",
          strokeWidth: 3,
          strokeDasharray: "8,4",
        },
      });
    });

    // Connect last core level to bonus levels
    if (coreLevels.length > 0 && bonusLevels.length > 0) {
      const lastCoreLevel = coreLevels[coreLevels.length - 1];
      bonusLevels.forEach((bonusLevel) => {
        edges.push({
          id: `edge-bonus-${bonusLevel.id}`,
          source: `level-${lastCoreLevel.id}`,
          target: `level-${bonusLevel.id}`,
          animated: allCoreLevelsCompleted,
          style: {
            stroke: allCoreLevelsCompleted 
              ? "hsl(var(--orange))" 
              : "hsl(var(--border))",
            strokeWidth: 3,
            strokeDasharray: "8,4",
          },
        });
      });
    }

    return edges;
  }, [topic, coreLevels, bonusLevels, allCoreLevelsCompleted]);

  if (!topic) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Topic not found</h1>
          <Button onClick={() => navigate("/levels")}>Back to Topics</Button>
        </div>
      </MainLayout>
    );
  }

  const completedCount = coreLevels.filter(
    (l) => l.status === "completed"
  ).length;

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="outline"
            onClick={() => navigate("/levels")}
            className="gap-2 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={16} />
            Back to Topics
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-base px-5 py-2 border-2">
              {completedCount} / {coreLevels.length} Core Complete
            </Badge>
            <Badge className="text-base px-5 py-2 bg-primary/90">{topic.complexity}</Badge>
            {allCoreLevelsCompleted && (
              <Badge className="text-base px-5 py-2 bg-orange text-white animate-pulse shadow-eco-lg">
                ⭐ Bonus Unlocked!
              </Badge>
            )}
          </div>
        </div>

        {/* Topic Info */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border border-primary/20 p-10 animate-fade-in">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {topic.name}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">{topic.description}</p>
          </div>
        </div>

        {/* React Flow Node Map */}
        <div className="h-[700px] bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/10 rounded-2xl overflow-hidden shadow-eco-lg animate-fade-in">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            attributionPosition="bottom-right"
            minZoom={0.4}
            maxZoom={1.5}
          >
            <Background gap={16} size={1} color="hsl(var(--primary) / 0.1)" />
            <Controls className="bg-card/90 backdrop-blur border border-primary/20" />
          </ReactFlow>
        </div>
      </div>
    </MainLayout>
  );
};

export default TopicMap;
