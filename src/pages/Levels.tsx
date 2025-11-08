import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { TopicSection } from "@/components/TopicSection";
import { LevelNode } from "@/components/LevelNode";
import { topics, bonusLevels } from "@/config/levelsConfig";
import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Levels = () => {
  const navigate = useNavigate();

  const handleBonusLevelClick = (bonusId: number) => {
    navigate(`/levels/bonus/${bonusId}`);
  };

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            ClimaQuest – Levels
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose a level to learn about climate topics. Complete challenges to unlock new content and earn eco-points!
          </p>
        </div>

        {/* Topic Sections - Each topic with its own level path */}
        <div className="space-y-8">
          {topics.map((topic) => (
            <TopicSection key={topic.id} topic={topic} />
          ))}
        </div>

        {/* Bonus Levels Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-orange" />
            <h2 className="text-3xl font-bold text-foreground">Bonus Levels</h2>
            <Sparkles className="w-6 h-6 text-orange" />
          </div>
          
          <Card className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {bonusLevels.map((bonus) => (
                <LevelNode
                  key={bonus.id}
                  id={bonus.id}
                  title={bonus.title}
                  status={bonus.status}
                  isBonus
                  onClick={() => handleBonusLevelClick(bonus.id)}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">
              Complete all core levels to unlock bonus challenges
            </p>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Levels;
