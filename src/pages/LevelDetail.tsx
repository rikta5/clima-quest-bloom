import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { coreLevels } from "@/config/levelsConfig";
import { ArrowLeft, Play, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LevelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const levelId = parseInt(id || "1");
  
  const level = coreLevels.find(l => l.id === levelId);

  if (!level) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Level not found</h1>
          <Button onClick={() => navigate("/levels")}>
            Back to Levels
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isLocked = level.status === "locked";

  return (
    <MainLayout>
      <div className="space-y-8 max-w-4xl mx-auto">
        {/* Back Button */}
        <Button
          variant="outline"
          onClick={() => navigate("/levels")}
          className="gap-2"
        >
          <ArrowLeft size={16} />
          Back to Levels
        </Button>

        {/* Level Header */}
        <Card className="p-8 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-4xl font-bold text-foreground">
                  Level {level.id}: {level.title}
                </h1>
                {isLocked && <Lock className="w-6 h-6 text-muted-foreground" />}
              </div>
              <p className="text-lg text-muted-foreground">{level.description}</p>
            </div>
            <Badge
              variant={level.status === "completed" ? "default" : "secondary"}
              className="text-sm px-4 py-2"
            >
              {level.status === "completed" ? "Completed" : level.status === "unlocked" ? "Available" : "Locked"}
            </Badge>
          </div>

          {!isLocked && (
            <Button size="lg" className="gap-2">
              <Play size={20} />
              Start Level
            </Button>
          )}

          {isLocked && (
            <div className="bg-muted/50 border border-border rounded-lg p-6 text-center">
              <Lock className="w-12 h-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-muted-foreground">
                Complete previous levels to unlock this content
              </p>
            </div>
          )}
        </Card>

        {/* Level Content Preview */}
        {!isLocked && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">What You'll Learn</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Key concepts and definitions</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Real-world applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Interactive challenges</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Actionable climate solutions</span>
                </li>
              </ul>
            </Card>

            <Card className="p-6 space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Rewards</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/10 rounded-lg">
                  <span className="text-foreground">Eco-Points</span>
                  <span className="font-bold text-accent">+50</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-orange/10 rounded-lg">
                  <span className="text-foreground">Achievement Badge</span>
                  <span className="font-bold text-orange">+1</span>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LevelDetail;
