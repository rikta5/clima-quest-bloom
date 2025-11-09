import { MainLayout } from "@/components/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Recycle, ThermometerSun } from "lucide-react";

const ClimateLevels = () => {
  const navigate = useNavigate();

  const levels = [
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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-12 px-4">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Climate Education Topics
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore real climate data through AI-powered lessons and quizzes
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {levels.map((level) => {
              const Icon = level.icon;
              return (
                <Card
                  key={level.id}
                  className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden border-2 hover:border-primary"
                  onClick={() => navigate(`/climate-lesson/${level.id}`)}
                >
                  <div className={`h-2 bg-gradient-to-r ${level.color}`} />
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${level.color} text-white group-hover:scale-110 transition-transform`}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <CardTitle className="text-2xl">{level.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {level.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ClimateLevels;
