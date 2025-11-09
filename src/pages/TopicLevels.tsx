import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Award, Sparkles, Trophy } from 'lucide-react';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useEffect, useState } from 'react';

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

// Circular positions for 10 levels in a web-like pattern
const getNodePosition = (index: number, total: number) => {
  const patterns = [
    // Center start
    { x: 50, y: 50 },
    // First ring - 3 nodes
    { x: 50, y: 20 },
    { x: 75, y: 35 },
    { x: 25, y: 35 },
    // Second ring - 3 nodes
    { x: 80, y: 50 },
    { x: 65, y: 70 },
    { x: 20, y: 50 },
    // Third ring - 3 nodes
    { x: 50, y: 80 },
    { x: 35, y: 70 },
    { x: 85, y: 70 },
  ];
  return patterns[index] || { x: 50, y: 50 };
};

export default function TopicLevels() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const { getTopicLevelStatus, getLessonProgress, getCorrectAnswers, getMedalForLevel, getTopicCompletionStats, LESSONS_PER_LEVEL } = useTopicProgress();
  const [isVisible, setIsVisible] = useState(false);
  
  const config = topicId ? levelConfig[topicId as keyof typeof levelConfig] : null;
  const stats = topicId ? getTopicCompletionStats(topicId) : null;

  useEffect(() => {
    setIsVisible(true);
  }, []);

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
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 overflow-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        <div className="max-w-6xl mx-auto space-y-8 relative z-10">
          <Button
            variant="ghost"
            onClick={() => navigate('/levels')}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Topics
          </Button>

          <div className={`text-center space-y-3 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                {config.title}
              </h1>
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-muted-foreground">
              {stats ? `${stats.completed} of ${stats.total} lessons completed • ${stats.levels}/10 levels mastered` : 'Complete all 50 lessons across 10 levels'}
            </p>
          </div>

          {/* Web/Circular Layout */}
          <div className={`relative w-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
            <div className="relative w-full aspect-[4/3] max-w-5xl mx-auto">
              {/* SVG Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: 'hsl(var(--primary))', stopOpacity: 0.3 }} />
                    <stop offset="100%" style={{ stopColor: 'hsl(var(--accent))', stopOpacity: 0.3 }} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Draw connections between sequential levels */}
                {config.levels.map((level, index) => {
                  if (index === config.levels.length - 1) return null;
                  const pos1 = getNodePosition(index, config.levels.length);
                  const pos2 = getNodePosition(index + 1, config.levels.length);
                  const status1 = topicId ? getTopicLevelStatus(topicId, level.id) : 'locked';
                  const status2 = topicId ? getTopicLevelStatus(topicId, config.levels[index + 1].id) : 'locked';
                  const isActive = status1 === 'completed' || status2 === 'unlocked' || status2 === 'completed';
                  
                  return (
                    <line
                      key={`line-${index}`}
                      x1={`${pos1.x}%`}
                      y1={`${pos1.y}%`}
                      x2={`${pos2.x}%`}
                      y2={`${pos2.y}%`}
                      stroke={isActive ? "url(#lineGradient)" : "hsl(var(--muted))"}
                      strokeWidth="3"
                      strokeDasharray={isActive ? "0" : "5,5"}
                      className={isActive ? "animate-pulse" : ""}
                      style={{ 
                        filter: isActive ? "url(#glow)" : "none",
                        opacity: isActive ? 1 : 0.3
                      }}
                    />
                  );
                })}
              </svg>

              {/* Level Nodes */}
              {config.levels.map((level, index) => {
                const position = getNodePosition(index, config.levels.length);
                const status = topicId ? getTopicLevelStatus(topicId, level.id) : 'locked';
                const lessonsCompleted = topicId ? getLessonProgress(topicId, level.id) : 0;
                const correctAnswers = topicId ? getCorrectAnswers(topicId, level.id) : 0;
                const medal = getMedalForLevel(correctAnswers);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const lessonProgress = (lessonsCompleted / LESSONS_PER_LEVEL) * 100;

                return (
                  <div
                    key={level.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      zIndex: 10,
                      animationDelay: `${index * 100}ms`,
                      animation: isVisible ? 'scale-in 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    <button
                      onClick={() => !isLocked && navigate(`/climate-lesson/${topicId}/${level.id}`)}
                      disabled={isLocked}
                      className="group relative"
                    >
                      {/* Glow effect for active/completed */}
                      {!isLocked && (
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${difficultyColors[level.difficulty]} blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`} />
                      )}
                      
                      {/* Main node circle */}
                      <div
                        className={`
                          relative w-20 h-20 md:w-24 md:h-24 rounded-full 
                          flex items-center justify-center
                          border-4 font-bold text-xl
                          transition-all duration-300
                          ${isLocked 
                            ? 'bg-muted border-muted-foreground/20 cursor-not-allowed' 
                            : `bg-gradient-to-br ${difficultyColors[level.difficulty]} border-white shadow-eco-lg cursor-pointer hover:scale-125 hover:rotate-12`
                          }
                        `}
                      >
                        {isLocked && <Lock className="w-6 h-6 text-muted-foreground" />}
                        {!isLocked && !isCompleted && <span className="text-white">{level.id}</span>}
                        {isCompleted && <CheckCircle2 className="w-8 h-8 text-white" />}
                        
                        {/* Medal overlay */}
                        {medal && (
                          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">
                            {medal === 'gold' ? '🥇' : medal === 'silver' ? '🥈' : '🥉'}
                          </div>
                        )}
                        
                        {/* Sparkles for unlocked */}
                        {status === 'unlocked' && (
                          <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-yellow-400 animate-pulse" />
                        )}
                      </div>

                      {/* Info card on hover */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                        <div className="bg-card border-2 border-border rounded-xl p-4 shadow-eco-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${difficultyColors[level.difficulty]} text-white`}>
                              {level.difficulty}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium">
                              Level {level.id}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-foreground">{level.title}</h4>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-semibold text-primary">{lessonsCompleted}/{LESSONS_PER_LEVEL}</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-primary to-accent"
                                style={{ width: `${lessonProgress}%` }}
                              />
                            </div>
                          </div>
                          {!isLocked && (
                            <div className="text-xs font-semibold text-primary text-center pt-1">
                              {isCompleted ? '✓ Completed' : 'Click to Play'}
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className={`mt-12 p-6 rounded-xl bg-card/50 backdrop-blur-sm border-2 border-border transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Difficulty Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(difficultyColors).map(([difficulty, colors]) => (
                <div key={difficulty} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${colors} shadow-lg`} />
                  <span className="text-sm font-semibold capitalize">{difficulty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
