import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Recycle, ThermometerSun, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { Badge } from "@/components/ui/badge";

const Levels = () => {
  const navigate = useNavigate();
  const { getTopicCompletionStats } = useTopicProgress();

  // Check if e-waste is fully completed (all 10 levels done)
  const eWasteStats = getTopicCompletionStats('e-waste');
  const isEWasteComplete = eWasteStats.levels >= 10;

  const topics = [
    {
      id: "e-waste",
      title: "E-Waste Recycling",
      description: "Learn about electronic waste recycling rates around the world and why it matters for our planet",
      icon: Recycle,
      color: "from-green-500 to-emerald-600",
      collection: "electronic-waste-recycling-rate",
      locked: false
    },
    {
      id: "temperature-change",
      title: "Temperature Change",
      description: "Understand global temperature anomalies and their impact on climate change",
      icon: ThermometerSun,
      color: "from-orange-500 to-red-600",
      collection: "temperature_change",
      locked: !isEWasteComplete
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Climate Education Topics
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore real climate data through AI-powered lessons and quizzes
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {topics.map((topic) => {
            const Icon = topic.icon;
            const isLocked = topic.locked;
            
            return (
              <Card
                key={topic.id}
                className={`group transition-all duration-300 overflow-hidden border-2 ${
                  isLocked 
                    ? 'opacity-60 cursor-not-allowed' 
                    : 'cursor-pointer hover:shadow-2xl hover:scale-105 hover:border-primary'
                }`}
                onClick={() => !isLocked && navigate(`/topic/${topic.id}`)}
              >
                <div className={`h-2 bg-gradient-to-r ${topic.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color} text-white ${!isLocked && 'group-hover:scale-110'} transition-transform relative`}>
                      {isLocked ? (
                        <Lock className="w-8 h-8" />
                      ) : (
                        <Icon className="w-8 h-8" />
                      )}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-2xl flex items-center gap-2">
                        {topic.title}
                        {isLocked && (
                          <Badge variant="outline" className="text-xs">
                            Complete E-Waste first
                          </Badge>
                        )}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {topic.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </MainLayout>
  );
};

export default Levels;
