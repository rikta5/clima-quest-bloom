import { MainLayout } from "@/components/MainLayout";
import { TopicCarousel } from "@/components/TopicCarousel";
import { useTopics } from "@/hooks/useTopics";
import { Card } from "@/components/ui/card";
import { Loader2, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const Levels = () => {
  const { topics, loading, error } = useTopics();

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center py-12 space-y-4">
          <p className="text-destructive font-semibold">{error}</p>
          <p className="text-muted-foreground">Please make sure topics are configured in Firestore</p>
        </div>
      </MainLayout>
    );
  }

  if (topics.length === 0) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">No topics available yet</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        <TopicCarousel topics={topics} />
        
        {/* AI-Powered Climate Lessons */}
        <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 hover:border-primary/40 transition-all">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
                <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI-Powered Climate Lessons
                </h2>
              </div>
              <p className="text-muted-foreground">
                Learn about real climate data through interactive AI-generated lessons and quizzes
              </p>
            </div>
            <Link 
              to="/climate-levels"
              className="px-6 py-3 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              Start Learning
              <Sparkles className="w-5 h-5" />
            </Link>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Levels;
