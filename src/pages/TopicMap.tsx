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

  // Create nodes from levels
  const nodes: Node[] = useMemo(() => {
    if (!topic) return [];

    return topic.levels.map((level, index) => {
      const row = Math.floor(index / 3);
      const col = index % 3;
      const isEvenRow = row % 2 === 0;
      const xPosition = isEvenRow
        ? col * horizontalSpacing
        : (2 - col) * horizontalSpacing;

      let nodeColor = "#e5e7eb"; // locked (muted)
      let textColor = "#6b7280";
      let borderColor = "#d1d5db";

      if (level.status === "completed") {
        nodeColor = "hsl(var(--accent))";
        textColor = "hsl(var(--accent-foreground))";
        borderColor = "hsl(var(--accent))";
      } else if (level.status === "unlocked") {
        nodeColor = "hsl(var(--secondary))";
        textColor = "hsl(var(--secondary-foreground))";
        borderColor = "hsl(var(--secondary))";
      }

      return {
        id: `level-${level.id}`,
        type: "default",
        position: { x: xPosition, y: row * verticalSpacing },
        data: {
          label: (
            <div
              className="flex flex-col items-center justify-center p-4 cursor-pointer"
              onClick={() => {
                if (level.status !== "locked") {
                  navigate(`/levels/${level.id}`);
                }
              }}
            >
              <div className="text-center space-y-2">
                {level.status === "locked" && (
                  <Lock className="w-8 h-8 mx-auto" />
                )}
                {level.status === "unlocked" && (
                  <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl mx-auto">
                    {level.id}
                  </div>
                )}
                {level.status === "completed" && (
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
          cursor: level.status !== "locked" ? "pointer" : "not-allowed",
          boxShadow:
            level.status !== "locked"
              ? "0 4px 14px rgba(31, 166, 74, 0.15)"
              : "none",
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });
  }, [topic, navigate]);

  // Create edges connecting the nodes
  const edges: Edge[] = useMemo(() => {
    if (!topic) return [];

    return topic.levels.slice(0, -1).map((_, index) => ({
      id: `edge-${index}`,
      source: `level-${topic.levels[index].id}`,
      target: `level-${topic.levels[index + 1].id}`,
      animated: topic.levels[index].status === "completed",
      style: {
        stroke: "hsl(var(--border))",
        strokeWidth: 3,
        strokeDasharray: "8,4",
      },
    }));
  }, [topic]);

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

  const completedCount = topic.levels.filter(
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
              {completedCount} / {topic.levels.length} Complete
            </Badge>
            <Badge className="text-sm px-4 py-2">{topic.complexity}</Badge>
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
