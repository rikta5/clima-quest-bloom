import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Film } from "lucide-react";

const Reels = () => {
  return (
    <MainLayout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">Climate Reels</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Short, engaging videos about climate action and sustainability
          </p>
        </div>

        <Card className="p-12 text-center">
          <Film className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Coming Soon</h2>
          <p className="text-muted-foreground">
            Exciting climate content is on the way!
          </p>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reels;
