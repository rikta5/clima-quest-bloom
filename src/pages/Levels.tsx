import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { NodeCircle } from "@/components/NodeCircle";
import { Badge } from "@/components/ui/badge";

const Levels = () => {
  // Mock data - will be replaced with real data later
  const levels = [
    { id: 1, status: "completed" as const, topic: "Climate Basics" },
    { id: 2, status: "completed" as const, topic: "Carbon Footprint" },
    { id: 3, status: "active" as const, topic: "Renewable Energy" },
    { id: 4, status: "locked" as const, topic: "Ocean Conservation" },
    { id: 5, status: "locked" as const, topic: "Sustainable Living" },
    { id: 6, status: "locked" as const, topic: "Biodiversity" },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Your Learning Path</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Progress through levels to master climate action and sustainability
          </p>
        </div>

        <Card className="p-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 place-items-center">
            {levels.map((level) => (
              <div key={level.id} className="flex flex-col items-center gap-3">
                <NodeCircle
                  number={level.id}
                  status={level.status}
                  size="lg"
                  onClick={() => console.log(`Level ${level.id} clicked`)}
                />
                <Badge variant={level.status === "locked" ? "secondary" : "default"}>
                  {level.topic}
                </Badge>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Levels;
