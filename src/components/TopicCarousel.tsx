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
  const coreLevels = currentTopic.levels.filter(l => l.type === "core");
  const completedCount = coreLevels.filter(l => l.status === "completed").length;

  const complexityColors = {
    Beginner: "bg-accent text-accent-foreground",
    Intermediate: "bg-orange text-white",
    Advanced: "bg-destructive text-destructive-foreground"
  };

  return (
    <div className="relative w-full h-[calc(100vh-80px)]">
      {/* Main Full-Width Slide */}
      <Card className="w-full h-full shadow-2xl border-none rounded-none overflow-hidden">
        <div className="grid md:grid-cols-2 gap-0 h-full">
          {/* Image Section */}
          <div className="relative h-full">
            <img
              src={currentTopic.image}
              alt={currentTopic.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <Badge 
              className={`absolute top-8 right-8 text-base px-6 py-2 ${complexityColors[currentTopic.complexity]}`}
            >
              {currentTopic.complexity}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="p-12 md:p-16 flex flex-col justify-center space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <h2 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                  {currentTopic.name}
                </h2>
                <p className="text-muted-foreground text-xl leading-relaxed">
                  {currentTopic.description}
                </p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-3">
                  <span className="text-base text-muted-foreground font-medium">Total Levels:</span>
                  <Badge variant="outline" className="text-base px-4 py-1.5">
                    {currentTopic.levels.length}
                  </Badge>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="flex justify-between text-base">
                  <span className="text-muted-foreground font-medium">Your Progress</span>
                  <span className="font-bold text-foreground">
                    {completedCount} / {coreLevels.length} Core Levels
                  </span>
                </div>
                <div className="h-4 bg-muted rounded-full overflow-hidden shadow-inner">
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
              className="w-full gap-3 h-16 text-xl font-semibold shadow-eco-lg hover:shadow-eco transition-all"
              onClick={() => navigate(`/levels/topic/${currentTopic.id}`)}
            >
              Start Learning
              <ArrowRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons - Absolutely Positioned */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-8 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 shadow-xl bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all z-10"
        onClick={prevSlide}
        disabled={currentIndex === 0}
      >
        <ChevronLeft className="w-7 h-7" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-8 top-1/2 -translate-y-1/2 rounded-full w-14 h-14 shadow-xl bg-card/90 backdrop-blur hover:bg-primary hover:text-primary-foreground transition-all z-10"
        onClick={nextSlide}
        disabled={currentIndex === topics.length - 1}
      >
        <ChevronRight className="w-7 h-7" />
      </Button>

      {/* Indicators - Absolutely Positioned at Bottom */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex justify-center gap-3 z-10">
        {topics.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2.5 rounded-full transition-all ${
              index === currentIndex
                ? "w-12 bg-primary shadow-eco"
                : "w-2.5 bg-card/80 backdrop-blur hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
