import { MainLayout } from "@/components/MainLayout";
import { TopicCarousel } from "@/components/TopicCarousel";
import { useTopics } from "@/hooks/useTopics";
import { Loader2 } from "lucide-react";

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
      <TopicCarousel topics={topics} />
    </MainLayout>
  );
};

export default Levels;
