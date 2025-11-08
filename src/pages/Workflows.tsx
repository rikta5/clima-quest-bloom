import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

const Workflows = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Documentation</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Learn how to use ClimaQuest effectively
          </p>
        </div>

        <Card className="p-12 text-center">
          <BookOpen className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Documentation</h2>
          <p className="text-muted-foreground">
            Guides and resources will be available here soon!
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Workflows;
