import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Award } from 'lucide-react';
import { useTopicProgress } from '@/hooks/useTopicProgress';

const levelConfig = {
  'e-waste': {
    title: 'E-Waste Recycling Journey',
    color: 'from-green-500 to-emerald-600',
    levels: [
      { id: 1, title: 'Introduction to E-Waste', difficulty: 'beginner', locked: false },
      { id: 2, title: 'Understanding Recycling Rates', difficulty: 'beginner', locked: false },
      { id: 3, title: 'Global E-Waste Patterns', difficulty: 'beginner', locked: false },
      { id: 4, title: 'Environmental Impact', difficulty: 'intermediate', locked: false },
      { id: 5, title: 'Economic Benefits', difficulty: 'intermediate', locked: false },
      { id: 6, title: 'Regional Comparisons', difficulty: 'intermediate', locked: false },
      { id: 7, title: 'Best Practices Analysis', difficulty: 'advanced', locked: false },
      { id: 8, title: 'Policy & Legislation', difficulty: 'advanced', locked: false },
      { id: 9, title: 'Future Trends', difficulty: 'advanced', locked: false },
      { id: 10, title: 'Expert Challenge', difficulty: 'expert', locked: false },
    ]
  },
  'temperature-change': {
    title: 'Temperature Change Investigation',
    color: 'from-orange-500 to-red-600',
    levels: [
      { id: 1, title: 'What is Temperature Anomaly?', difficulty: 'beginner', locked: false },
      { id: 2, title: 'Reading Climate Data', difficulty: 'beginner', locked: false },
      { id: 3, title: 'Regional Temperature Patterns', difficulty: 'beginner', locked: false },
      { id: 4, title: 'Seasonal Variations', difficulty: 'intermediate', locked: false },
      { id: 5, title: 'Historical Trends', difficulty: 'intermediate', locked: false },
      { id: 6, title: 'Climate Change Indicators', difficulty: 'intermediate', locked: false },
      { id: 7, title: 'Impact on Ecosystems', difficulty: 'advanced', locked: false },
      { id: 8, title: 'Human Activities Connection', difficulty: 'advanced', locked: false },
      { id: 9, title: 'Future Projections', difficulty: 'advanced', locked: false },
      { id: 10, title: 'Climate Action Challenge', difficulty: 'expert', locked: false },
    ]
  }
};

const difficultyColors = {
  beginner: 'from-blue-400 to-cyan-400',
  intermediate: 'from-yellow-400 to-orange-400',
  advanced: 'from-red-400 to-pink-400',
  expert: 'from-purple-500 to-indigo-600'
};

export default function TopicLevels() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { getTopicLevelStatus, getLessonProgress, getCorrectAnswers, getMedalForLevel, getTopicCompletionStats, LESSONS_PER_LEVEL } = useTopicProgress();
  
  const config = topicId ? levelConfig[topicId as keyof typeof levelConfig] : null;
  const stats = topicId ? getTopicCompletionStats(topicId) : null;

  if (!config) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-muted-foreground">Topic not found</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/levels')}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {config.title}
            </h1>
            <p className="text-muted-foreground">
              {stats ? `${stats.completed} of ${stats.total} lessons completed • ${stats.levels}/10 levels done` : 'Complete all 50 lessons across 10 levels'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {config.levels.map((level) => {
              const status = topicId ? getTopicLevelStatus(topicId, level.id) : 'locked';
              const lessonsCompleted = topicId ? getLessonProgress(topicId, level.id) : 0;
              const correctAnswers = topicId ? getCorrectAnswers(topicId, level.id) : 0;
              const medal = getMedalForLevel(correctAnswers);
              const isLocked = status === 'locked';
              const isCompleted = status === 'completed';
              const lessonProgress = (lessonsCompleted / LESSONS_PER_LEVEL) * 100;

              return (
                <button
                  key={level.id}
                  onClick={() => !isLocked && navigate(`/climate-lesson/${topicId}/${level.id}`)}
                  disabled={isLocked}
                  className="group relative overflow-hidden rounded-xl border-2 border-border bg-card p-6 text-left transition-all hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${difficultyColors[level.difficulty]} opacity-10 group-hover:opacity-20 transition-opacity`} />
                  
                  {isCompleted && medal && (
                    <div className="absolute top-2 right-2 z-10 text-3xl">
                      {medal === 'gold' ? '🥇' : medal === 'silver' ? '🥈' : '🥉'}
                    </div>
                  )}
                  
                  {isCompleted && !medal && (
                    <div className="absolute top-2 right-2 z-10">
                      <CheckCircle2 className="w-6 h-6 text-green-500 fill-green-500/20" />
                    </div>
                  )}
                  
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${difficultyColors[level.difficulty]} text-white font-bold text-lg shadow-lg`}>
                        {isLocked ? <Lock className="w-5 h-5" /> : level.id}
                      </div>
                      <span className={`rounded-full px-3 py-1 text-xs font-semibold bg-gradient-to-r ${difficultyColors[level.difficulty]} text-white`}>
                        {level.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {level.title}
                    </h3>
                    
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground font-medium">
                          {lessonsCompleted}/{LESSONS_PER_LEVEL} lessons
                        </span>
                        <span className="font-semibold text-primary">
                          {isCompleted ? (medal ? `${correctAnswers}/5 ✓` : 'Done') : isLocked ? 'Locked' : lessonsCompleted === 0 ? 'Start' : 'In Progress'}
                        </span>
                      </div>
                      <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                          style={{ width: `${lessonProgress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-lg bg-muted/50 border">
            <h3 className="font-semibold mb-2">Difficulty Levels:</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(difficultyColors).map(([difficulty, colors]) => (
                <div key={difficulty} className="flex items-center gap-2">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors}`} />
                  <span className="text-sm capitalize">{difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
