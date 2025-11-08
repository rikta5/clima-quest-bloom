import { useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import { topics } from "@/config/levelsConfig";
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

  const topic = topics.find((t) => t.id === topicId);

  const nodeWidth = 150;
  const nodeHeight = 150;
  const horizontalSpacing = 250;
  const verticalSpacing = 200;

  // Separate core and bonus levels
  const coreLevels = useMemo(() => 
    topic?.levels.filter(l => l.type === "core") || [], 
    [topic]
  );
  
  const bonusLevels = useMemo(() => 
    topic?.levels.filter(l => l.type === "bonus") || [], 
    [topic]
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

      let nodeColor = "#e5e7eb"; // locked (muted)
      let textColor = "#6b7280";
      let borderColor = "#d1d5db";

      if (effectiveStatus === "completed") {
        nodeColor = "hsl(var(--accent))";
        textColor = "hsl(var(--accent-foreground))";
        borderColor = "hsl(var(--accent))";
      } else if (effectiveStatus === "unlocked") {
        nodeColor = isBonus 
          ? "hsl(var(--orange) / 0.2)"
          : "hsl(var(--secondary))";
        textColor = isBonus
          ? "hsl(var(--orange))"
          : "hsl(var(--secondary-foreground))";
        borderColor = isBonus 
          ? "hsl(var(--orange))"
          : "hsl(var(--secondary))";
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
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-orange text-white rounded-full flex items-center justify-center text-xs font-bold">
                    ⭐
                  </div>
                )}
                {effectiveStatus === "locked" && (
                  <Lock className="w-8 h-8 mx-auto" />
                )}
                {effectiveStatus === "unlocked" && (
                  <div className={`w-12 h-12 rounded-full ${isBonus ? 'bg-orange text-white' : 'bg-primary text-primary-foreground'} flex items-center justify-center font-bold text-xl mx-auto`}>
                    {level.id}
                  </div>
                )}
                {effectiveStatus === "completed" && (
                  <CheckCircle2 className="w-10 h-10 mx-auto fill-current" />
                )}
                <p className="font-semibold text-sm line-clamp-2">
                  {level.title}
                </p>
              </div>
            </div>
          ),
        },
        style: {
          background: nodeColor,
          color: textColor,
          border: `3px solid ${borderColor}`,
          borderRadius: "16px",
          width: nodeWidth,
          height: nodeHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: effectiveStatus !== "locked" ? "pointer" : "not-allowed",
          boxShadow:
            effectiveStatus !== "locked"
              ? isBonus
                ? "0 4px 14px rgba(255, 149, 0, 0.25)"
                : "0 4px 14px rgba(31, 166, 74, 0.15)"
              : "none",
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
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/levels")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back to Topics
          </Button>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-sm px-4 py-2">
              {completedCount} / {coreLevels.length} Core Complete
            </Badge>
            <Badge className="text-sm px-4 py-2">{topic.complexity}</Badge>
            {allCoreLevelsCompleted && (
              <Badge className="text-sm px-4 py-2 bg-orange text-white">
                Bonus Unlocked!
              </Badge>
            )}
          </div>
        </div>

        {/* Topic Info */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {topic.name}
          </h1>
          <p className="text-lg text-muted-foreground">{topic.description}</p>
        </div>

        {/* React Flow Node Map */}
        <div className="h-[600px] bg-card border border-border rounded-xl overflow-hidden shadow-eco-lg">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            fitView
            attributionPosition="bottom-right"
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
    </MainLayout>
  );
};

export default TopicMap;
