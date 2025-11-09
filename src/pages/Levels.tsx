import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Recycle, ThermometerSun } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Levels = () => {
  const navigate = useNavigate();

  const topics = [
    {
      id: "e-waste",
      title: "E-Waste Recycling",
      description: "Learn about electronic waste recycling rates around the world and why it matters for our planet",
      icon: Recycle,
      color: "from-green-500 to-emerald-600",
      collection: "electronic-waste-recycling-rate"
    },
    {
      id: "temperature-change",
      title: "Temperature Change",
      description: "Understand global temperature anomalies and their impact on climate change",
      icon: ThermometerSun,
      color: "from-orange-500 to-red-600",
      collection: "temperature_change"
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
            return (
              <Card
                key={topic.id}
                className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 hover:border-primary"
                onClick={() => navigate(`/topic/${topic.id}`)}
              >
                <div className={`h-2 bg-gradient-to-r ${topic.color}`} />
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${topic.color} text-white group-hover:scale-110 transition-transform`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <CardTitle className="text-2xl">{topic.title}</CardTitle>
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
