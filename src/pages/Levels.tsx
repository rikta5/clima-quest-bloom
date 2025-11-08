import { MainLayout } from "@/components/MainLayout";
import { TopicCarousel } from "@/components/TopicCarousel";
import { topics } from "@/config/levelsConfig";

const Levels = () => {
  return (
    <MainLayout>
      <TopicCarousel topics={topics} />
    </MainLayout>
  );
};

export default Levels;
