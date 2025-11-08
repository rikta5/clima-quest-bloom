import { TopicCarousel } from "@/components/TopicCarousel";
import { topics } from "@/config/levelsConfig";

const Levels = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="text-center py-8 px-4">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Choose Your Path
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-2">
          Select a topic to begin your climate learning journey
        </p>
      </div>

      {/* Full Page Carousel */}
      <div className="flex-1">
        <TopicCarousel topics={topics} />
      </div>
    </div>
  );
};

export default Levels;
