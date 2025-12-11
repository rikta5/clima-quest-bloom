import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/components/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Lock, CheckCircle2, Award, Sparkles, Trophy, ChevronRight } from 'lucide-react';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useEffect, useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

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

const difficultyColors: Record<string, string> = {
  beginner: 'from-green-600 to-emerald-700',
  intermediate: 'from-yellow-500 to-orange-500',
  advanced: 'from-red-500 to-pink-500',
  expert: 'from-purple-600 to-indigo-700'
};

const difficultyShadows: Record<string, string> = {
  beginner: 'shadow-[0_0_20px_rgba(5,150,105,0.5)]',
  intermediate: 'shadow-[0_0_20px_rgba(249,115,22,0.5)]',
  advanced: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',
  expert: 'shadow-[0_0_20px_rgba(124,58,237,0.5)]'
};

// Flowing path positions - creates a natural S-curve journey
const webPositions = [
  { x: 20, y: 15 },   // Level 1 - top left start
  { x: 35, y: 25 },   // Level 2 - flowing right
  { x: 50, y: 20 },   // Level 3 - top center
  { x: 65, y: 28 },   // Level 4 - continuing right
  { x: 75, y: 40 },   // Level 5 - curve down right
  { x: 70, y: 55 },   // Level 6 - middle right
  { x: 50, y: 60 },   // Level 7 - center
  { x: 30, y: 65 },   // Level 8 - flowing left
  { x: 20, y: 77 },   // Level 9 - bottom left
  { x: 50, y: 85 },   // Level 10 - bottom center (final boss)
];

const getNodePosition = (index: number) => {
  return webPositions[index] || { x: 50, y: 50 };
};

// Smooth curved segment between two node centers
const getSegmentPath = (
  from: { x: number; y: number },
  to: { x: number; y: number },
  index: number
) => {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;

  // Alternate curve direction for a gentle S-shape
  const curveOffset = 7;
  const cpY = midY + (index % 2 === 0 ? -curveOffset : curveOffset);

  return `M ${from.x} ${from.y} Q ${midX} ${cpY}, ${to.x} ${to.y}`;
};

export default function TopicLevels() {
  const { topicId } = useParams<{ topicId: string }>();
  const navigate = useNavigate();
  const {
    getTopicLevelStatus,
    getLessonProgress,
    getCorrectAnswers,
    getMedalForLevel,
    getTopicCompletionStats,
    LESSONS_PER_LEVEL
  } = useTopicProgress();
  const [isVisible, setIsVisible] = useState(false);
  const [pathProgress, setPathProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const config = topicId ? levelConfig[topicId as keyof typeof levelConfig] : null;
  const stats = topicId ? getTopicCompletionStats(topicId) : null;

  // Find the current active level (first unlocked)
  const currentLevelIndex =
    config?.levels.findIndex(
      level => topicId && getTopicLevelStatus(topicId, level.id) === 'unlocked'
    ) ?? -1;

  // Calculate completed levels with medals
  const completedWithMedals =
    config?.levels.filter(level => {
      const status = topicId ? getTopicLevelStatus(topicId, level.id) : 'locked';
      const correctAnswers = topicId ? getCorrectAnswers(topicId, level.id) : 0;
      const medal = getMedalForLevel(correctAnswers);
      return status === 'completed' && medal;
    }).length ?? 0;

  // Group levels into sections
  const sections = [
    { name: 'Beginner', range: [1, 3], color: 'from-green-600 to-emerald-700' },
    { name: 'Intermediate', range: [4, 7], color: 'from-yellow-500 to-orange-500' },
    { name: 'Advanced', range: [8, 10], color: 'from-red-500 to-pink-500' },
  ];

  const scrollToLevel = (levelId: number) => {
    const position = getNodePosition(levelId - 1);
    if (containerRef.current) {
      const container = containerRef.current.querySelector('.aspect-\\[4\\/3\\]') as HTMLElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        const targetY = (rect.height * position.y) / 100;
        
        window.scrollTo({
          top: targetY + container.offsetTop - window.innerHeight / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  const triggerConfetti = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 60,
      origin: { x, y },
      colors: ['#FFD700', '#FFA500', '#FF6347', '#87CEEB'],
      ticks: 100,
      gravity: 0.8,
      scalar: 0.8
    });
  };

  useEffect(() => {
    setIsVisible(true);

    let intervalId: number | undefined;
    const timeoutId = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setPathProgress(prev => {
          if (prev >= 100) {
            if (intervalId) window.clearInterval(intervalId);
            return 100;
          }
          return prev + 2;
        });
      }, 20);
    }, 500);

    return () => {
      window.clearTimeout(timeoutId);
      if (intervalId) window.clearInterval(intervalId);
    };
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

          <div
            className={`text-center space-y-4 transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'
            }`}
          >
            <div className="flex items-center justify-center gap-3">
              <Trophy className="w-8 h-8 text-primary" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                {config.title}
              </h1>
              <Trophy className="w-8 h-8 text-accent" />
            </div>
            <p className="text-lg text-muted-foreground">
              {stats
                ? `${stats.completed} of ${stats.total} lessons completed • ${stats.levels}/10 levels mastered`
                : 'Complete all 50 lessons across 10 levels'}
            </p>
            
            {/* Progress Indicator */}
            <div className="max-w-2xl mx-auto space-y-3 p-4 rounded-xl bg-card/80 backdrop-blur-sm border-2 border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-foreground">Journey Progress</span>
                <Badge variant="default" className="bg-gradient-to-r from-primary to-accent">
                  {stats?.levels || 0}/10 Levels
                </Badge>
              </div>
              <Progress value={(stats?.levels || 0) * 10} className="h-3" />
              
              {/* Section Navigation */}
              <div className="flex gap-2 justify-center flex-wrap pt-2">
                {sections.map(section => {
                  const sectionLevels =
                    config?.levels.filter(
                      l => l.id >= section.range[0] && l.id <= section.range[1]
                    ) ?? [];
                  const completedInSection = sectionLevels.filter(
                    l => topicId && getTopicLevelStatus(topicId, l.id) === 'completed'
                  ).length;
                  
                  return (
                    <Button
                      key={section.name}
                      variant="outline"
                      size="sm"
                      onClick={() => scrollToLevel(section.range[0])}
                      className={`gap-2 hover:scale-105 transition-all bg-gradient-to-r ${section.color} text-white border-0 hover:opacity-90`}
                    >
                      {section.name}
                      <Badge variant="secondary" className="bg-white/20 text-white border-0">
                        {completedInSection}/{sectionLevels.length}
                      </Badge>
                      <ChevronRight className="w-3 h-3" />
                    </Button>
                  );
                })}
              </div>
              
              {completedWithMedals > 0 && (
                <div className="text-center text-sm text-muted-foreground">
                  🏆 {completedWithMedals} level{completedWithMedals > 1 ? 's' : ''} completed with medals!
                </div>
              )}
            </div>
          </div>

          {/* Web/Circular Layout */}
          <div
            ref={containerRef}
            className={`relative w-full transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative w-full aspect-[4/3] max-w-5xl mx-auto">
              {/* SVG Connections */}
              <svg
                className="absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                style={{ zIndex: 1 }}
              >
                <defs>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop
                      offset="0%"
                      style={{ stopColor: 'hsl(145, 80%, 39%)', stopOpacity: 0.8 }}
                    />
                    <stop
                      offset="100%"
                      style={{ stopColor: 'hsl(152, 50%, 50%)', stopOpacity: 0.8 }}
                    />
                  </linearGradient>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#34d399', stopOpacity: 1 }} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                
                {/* Draw curved connections between sequential levels */}
                {config.levels.map((level, index) => {
                  if (index === config.levels.length - 1) return null;

                  const from = getNodePosition(index);
                  const to = getNodePosition(index + 1);

                  const status1 = topicId
                    ? getTopicLevelStatus(topicId, level.id)
                    : 'locked';
                  const isCompleted = status1 === 'completed';
                  const isActive = index <= currentLevelIndex;

                  const pathD = getSegmentPath(from, to, index);

                  return (
                    <g key={`line-${index}`}>
                      {/* Base dashed path */}
                      <path
                        d={pathD}
                        fill="none"
                        stroke="hsl(var(--muted-foreground))"
                        strokeWidth="0.8"
                        strokeDasharray="3 3"
                        opacity="0.35"
                        strokeLinecap="round"
                      />
                      {/* Active/progress overlay */}
                      {isActive && (
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isCompleted ? 'url(#activeGradient)' : 'url(#lineGradient)'}
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeDasharray="100"
                          strokeDashoffset={isCompleted ? 0 : 100 - pathProgress}
                          style={{
                            filter: 'url(#glow)',
                            transition: 'stroke-dashoffset 0.3s ease-out'
                          }}
                        />
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Level Nodes */}
              {config.levels.map((level, index) => {
                const position = getNodePosition(index);
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
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:z-[100] z-10"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      animationDelay: `${index * 100}ms`,
                      animation: isVisible ? 'scale-in 0.5s ease-out forwards' : 'none'
                    }}
                  >
                    <button
                      onClick={() =>
                        !isLocked && navigate(`/climate-lesson/${topicId}/${level.id}`)
                      }
                      onMouseEnter={e => medal && triggerConfetti(e)}
                      disabled={isLocked}
                      className="group relative"
                    >
                      {/* Particle effects for unlocked nodes */}
                      {status === 'unlocked' && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <div
                              key={`particle-${i}`}
                              className="absolute w-2 h-2 rounded-full bg-yellow-400"
                              style={{
                                top: '50%',
                                left: '50%',
                                animation: `float-particle ${
                                  2 + i * 0.3
                                }s ease-in-out infinite`,
                                animationDelay: `${i * 0.2}s`,
                                transform: `rotate(${i * 60}deg) translateX(40px)`
                              }}
                            />
                          ))}
                        </>
                      )}
                      
                      {/* Orbiting icons for active nodes */}
                      {status === 'unlocked' && (
                        <>
                          <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full"
                            style={{ animation: 'orbit 3s linear infinite' }}
                          >
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                          </div>
                          <div
                            className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full"
                            style={{ animation: 'orbit 3s linear infinite reverse' }}
                          >
                            <Trophy className="w-4 h-4 text-amber-500" />
                          </div>
                        </>
                      )}
                      
                      {/* Glow effect for active/completed */}
                      {!isLocked && (
                        <div
                          className={`absolute inset-0 rounded-full bg-gradient-to-br ${
                            difficultyColors[level.difficulty]
                          } blur-2xl opacity-40 group-hover:opacity-70 transition-opacity duration-300 ${
                            difficultyShadows[level.difficulty]
                          }`}
                        />
                      )}
                      
                      {/* Pulsing ring for unlocked */}
                      {status === 'unlocked' && (
                        <div className="absolute inset-0 rounded-full border-4 border-yellow-400 animate-ping opacity-75" />
                      )}
                      
                      {/* Main node circle */}
                      <div
                        className={`
                          relative w-20 h-20 md:w-24 md:h-24 rounded-full 
                          flex items-center justify-center
                          border-4 font-bold text-xl
                          transition-all duration-300
                          ${
                            isLocked
                              ? 'bg-muted border-muted-foreground/30 cursor-not-allowed opacity-60'
                              : `bg-gradient-to-br ${
                                  difficultyColors[level.difficulty]
                                } border-white ${difficultyShadows[level.difficulty]} cursor-pointer hover:scale-125 hover:rotate-12`
                          }
                        `}
                      >
                        {isLocked && <Lock className="w-6 h-6 text-muted-foreground" />}
                        {!isLocked && !isCompleted && (
                          <span className="text-white drop-shadow-lg">{level.id}</span>
                        )}
                        {isCompleted && (
                          <CheckCircle2 className="w-8 h-8 text-white drop-shadow-lg" />
                        )}
                        
                        {/* Medal overlay */}
                        {medal && (
                          <div className="absolute -top-2 -right-2 text-2xl animate-bounce drop-shadow-lg">
                            {medal === 'gold'
                              ? '🥇'
                              : medal === 'silver'
                              ? '🥈'
                              : '🥉'}
                          </div>
                        )}
                        
                        {/* Sparkles for unlocked */}
                        {status === 'unlocked' && (
                          <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-yellow-300 animate-pulse drop-shadow-lg" />
                        )}
                      </div>

                      {/* Info card on hover */}
                      <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-56 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                        <div className="bg-card border-2 border-border rounded-xl p-4 shadow-eco-lg space-y-2">
                          <div className="flex items-center justify-between">
                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full bg-gradient-to-r ${
                                difficultyColors[level.difficulty]
                              } text-white`}
                            >
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
                              <span className="font-semibold text-primary">
                                {lessonsCompleted}/{LESSONS_PER_LEVEL}
                              </span>
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
          <div
            className={`mt-12 p-6 rounded-xl bg-card/50 backdrop-blur-sm border-2 border-border transition-all duration-1000 delay-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
          >
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Difficulty Levels
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(difficultyColors).map(([difficulty, colors]) => (
                <div
                  key={difficulty}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
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
