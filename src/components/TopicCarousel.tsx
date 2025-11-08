import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Topic } from "@/config/levelsConfig";
import { useNavigate } from "react-router-dom";

interface TopicCarouselProps {
  topics: Topic[];
}

export const TopicCarousel = ({ topics }: TopicCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % topics.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + topics.length) % topics.length);
  };

  const currentTopic = topics[currentIndex];
  const coreLevels = currentTopic.levels.filter((l) => l.type === "core");
  const completedCount = coreLevels.filter((l) => l.status === "completed").length;

  const complexityColors = {
    Beginner: "bg-accent text-accent-foreground",
    Intermediate: "bg-orange text-white",
    Advanced: "bg-destructive text-destructive-foreground",
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      {/* Main Full-Width Slide */}
      <div className="w-full h-full border-none rounded-none overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {/* Image Section */}
          <div className="relative h-full">
            <img src={currentTopic.image} alt={currentTopic.name} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent md:bg-gradient-to-t md:from-black/70 md:via-black/20 md:to-transparent" />
            <Badge
              className={`absolute top-6 right-6 md:top-8 md:right-8 text-sm md:text-base px-4 md:px-6 py-1.5 md:py-2 ${complexityColors[currentTopic.complexity]}`}
            >
              {currentTopic.complexity}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="bg-background p-8 md:p-12 lg:p-16 flex flex-col justify-center space-y-6 md:space-y-8">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-3 md:space-y-4">
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">{currentTopic.name}</h2>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-2xl">{currentTopic.description}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 md:gap-6 pt-2 md:pt-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-sm md:text-base text-muted-foreground font-medium">Total Levels:</span>
                  <Badge variant="outline" className="text-sm md:text-base px-3 md:px-4 py-1 md:py-1.5">
                    {currentTopic.levels.length}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex justify-between text-sm md:text-base">
                  <span className="text-muted-foreground font-medium">Your Progress</span>
                  <span className="font-bold text-foreground">
                    {completedCount} / {coreLevels.length} Core Levels
                  </span>
                </div>
                <div className="h-3 md:h-4 bg-muted rounded-full overflow-hidden shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-700 shadow-eco"
                    style={{
                      width: `${coreLevels.length > 0 ? (completedCount / coreLevels.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full gap-2 md:gap-3 h-14 md:h-16 text-lg md:text-xl font-semibold shadow-eco-lg hover:shadow-eco transition-all"
              onClick={() => navigate(`/levels/topic/${currentTopic.id}`)}
            >
              Start Learning
              <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Buttons - Absolutely Positioned */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl bg-card/95 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all z-10 border-border/50"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 md:w-14 md:h-14 shadow-xl bg-card/95 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground transition-all z-10 border-border/50"
        onClick={nextSlide}
        disabled={currentIndex === topics.length - 1}
      >
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7" />
      </Button>

      {/* Indicators - Absolutely Positioned at Bottom */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-2 md:gap-3 z-10">
        {topics.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 md:h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-10 md:w-12 bg-primary shadow-eco"
                : "w-2 md:w-2.5 bg-card/80 backdrop-blur hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
