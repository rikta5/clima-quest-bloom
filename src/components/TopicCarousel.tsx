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

  const complexityColors = {
    Beginner: "bg-accent text-accent-foreground",
    Intermediate: "bg-orange text-white",
    Advanced: "bg-destructive text-destructive-foreground"
  };

  return (
    <div className="relative max-w-5xl mx-auto">
      {/* Main Carousel Card */}
      <Card className="overflow-hidden shadow-eco-lg">
        <div className="grid md:grid-cols-2 gap-0">
          {/* Image Section */}
          <div className="relative h-64 md:h-auto">
            <img
              src={currentTopic.image}
              alt={currentTopic.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <Badge 
              className={`absolute top-4 right-4 ${complexityColors[currentTopic.complexity]}`}
            >
              {currentTopic.complexity}
            </Badge>
          </div>

          {/* Content Section */}
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-foreground">
                  {currentTopic.name}
                </h2>
                <p className="text-muted-foreground text-lg">
                  {currentTopic.description}
                </p>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Levels:</span>
                  <Badge variant="outline">{currentTopic.levels.length}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Progress:</span>
                  <Badge variant="outline">
                    {currentTopic.levels.filter(l => l.status === "completed").length} / {currentTopic.levels.length}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4 mt-6">
              <Button
                size="lg"
                className="w-full gap-2 shadow-eco hover:shadow-eco-lg transition-all"
                onClick={() => navigate(`/levels/topic/${currentTopic.id}`)}
              >
                Enter Topic
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg bg-card hover:bg-primary hover:text-primary-foreground"
        onClick={prevSlide}
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-12 h-12 shadow-lg bg-card hover:bg-primary hover:text-primary-foreground"
        onClick={nextSlide}
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Indicators */}
      <div className="flex justify-center gap-2 mt-6">
        {topics.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all ${
              index === currentIndex
                ? "w-8 bg-primary"
                : "w-2 bg-border hover:bg-primary/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
