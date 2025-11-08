import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { bonusLevels } from "@/config/levelsConfig";
import { ArrowLeft, Crown, Lock, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const BonusLevelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bonusId = parseInt(id || "1");
  
  const bonus = bonusLevels.find(b => b.id === bonusId);

  if (!bonus) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Bonus level not found</h1>
          <Button onClick={() => navigate("/levels")}>
            Back to Levels
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isLocked = bonus.status === "locked";

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

        {/* Bonus Level Header */}
        <Card className="p-8 space-y-4 border-orange/30 shadow-eco-lg">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Crown className="w-8 h-8 text-orange" />
                <h1 className="text-4xl font-bold bg-gradient-to-r from-orange to-primary bg-clip-text text-transparent">
                  Bonus: {bonus.title}
                </h1>
                {isLocked && <Lock className="w-6 h-6 text-muted-foreground" />}
              </div>
              <p className="text-lg text-muted-foreground">{bonus.description}</p>
            </div>
            <Badge
              variant={bonus.status === "completed" ? "default" : "secondary"}
              className="text-sm px-4 py-2 bg-orange text-white"
            >
              {bonus.status === "completed" ? "Mastered" : "Bonus"}
            </Badge>
          </div>

          {isLocked && (
            <div className="bg-orange/10 border border-orange/30 rounded-lg p-8 text-center space-y-4">
              <Lock className="w-16 h-16 mx-auto text-orange" />
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-foreground">Complete All Core Levels</h3>
                <p className="text-muted-foreground">
                  Master levels 1-7 to unlock this exclusive bonus challenge
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Extra rewards and advanced content await!</span>
              </div>
            </div>
          )}

          {!isLocked && (
            <Button size="lg" className="gap-2 bg-orange hover:bg-orange/90">
              <Crown size={20} />
              Start Bonus Challenge
            </Button>
          )}
        </Card>

        {/* Bonus Content Preview */}
        {!isLocked && (
          <Card className="p-8 bg-gradient-to-br from-orange/5 to-primary/5">
            <div className="text-center space-y-4">
              <Sparkles className="w-12 h-12 mx-auto text-orange" />
              <h2 className="text-2xl font-bold text-foreground">
                Advanced Climate Challenge
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This bonus level contains advanced topics and real-world scenarios that will test your mastery of climate action.
              </p>
              <div className="flex items-center justify-center gap-6 pt-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange">+200</p>
                  <p className="text-sm text-muted-foreground">Eco-Points</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">+5</p>
                  <p className="text-sm text-muted-foreground">Achievements</p>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </MainLayout>
  );
};

export default BonusLevelDetail;
