import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { TopicCarousel } from "@/components/TopicCarousel";
import { topics } from "@/config/levelsConfig";

const Levels = () => {
  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Choose Your Path
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select a topic to begin your climate learning journey
          </p>
        </div>

        {/* Topic Carousel */}
        <TopicCarousel topics={topics} />
      </div>
    </MainLayout>
  );
};

export default Levels;
