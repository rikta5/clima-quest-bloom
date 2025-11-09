import { useState, useEffect } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTopics } from "@/hooks/useTopics";
import { Mail, User, CheckCircle2, Circle, LogOut, Loader2, Trophy, Target, Zap, TrendingUp, Calendar, Flame } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const { userData, loading } = useUserProgress();
  const { topics } = useTopics();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/auth');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  if (!userData) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Unable to load profile data</p>
        </div>
      </MainLayout>
    );
  }

  const progressPercentage = (userData.ecoPoints / userData.maxPoints) * 100;
  const avatarInitials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  
  // Calculate total completed lessons and levels from topicProgress
  let totalCompletedLessons = 0;
  let totalCompletedLevels = 0;
  let completedTopicsCount = 0;

  if (userData.topicProgress) {
    const topicIds = Object.keys(userData.topicProgress);
    
    topicIds.forEach(topicId => {
      const topicData = userData.topicProgress![topicId];
      let levelsInTopic = 0;
      
      Object.values(topicData).forEach(lessons => {
        const lessonCount = typeof lessons === 'number' ? lessons : 0;
        totalCompletedLessons += lessonCount;
        if (lessonCount >= 5) {
          levelsInTopic++;
          totalCompletedLevels++;
        }
      });
      
      // A topic is completed if all 10 levels are completed (50 lessons)
      if (levelsInTopic === 10) {
        completedTopicsCount++;
      }
    });
  }

  return (
    <MainLayout>
      <div className="space-y-8 relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 left-20 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <div className={`text-center space-y-4 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
          <div className="relative inline-block">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
              My Profile
            </h1>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-accent rounded-full animate-ping" />
          </div>
          <p className="text-xl text-muted-foreground">
            Track your climate learning journey
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                <Trophy className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{userData.ecoPoints}</p>
                <p className="text-sm text-muted-foreground">Eco Points</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-accent/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-eco">
                <Target className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{totalCompletedLevels}</p>
                <p className="text-sm text-muted-foreground">Levels Done</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-1 border-2 hover:border-primary/50 bg-gradient-to-br from-card to-primary/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                <Zap className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{completedTopicsCount}</p>
                <p className="text-sm text-muted-foreground">Topics</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-1 border-2 hover:border-accent/50 bg-gradient-to-br from-card to-accent/5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-eco animate-pulse">
                <Flame className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">{userData.streak || 0}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <Card className="p-8 space-y-6 hover:shadow-eco-lg transition-all duration-500 border-2 hover:border-primary/30">
              <div className="flex flex-col items-center space-y-6">
                {/* Avatar with glow effect */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent rounded-full blur-2xl opacity-50 animate-pulse" />
                  <Avatar className="relative w-40 h-40 border-4 border-primary shadow-eco-lg hover:scale-105 transition-transform duration-500">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-accent text-primary-foreground text-4xl font-bold">
                      {avatarInitials}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="w-full space-y-5">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <User size={16} className="text-primary" />
                      Name
                    </label>
                    <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-border hover:border-primary/30 transition-all duration-300">
                      <p className="text-foreground font-semibold text-lg">{userData.name}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                      <Mail size={16} className="text-accent" />
                      Email
                    </label>
                    <div className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl border-2 border-border hover:border-accent/30 transition-all duration-300">
                      <p className="text-foreground font-semibold break-all">{userData.email}</p>
                    </div>
                  </div>

                  <Button 
                    variant="outline" 
                    className="w-full h-12 hover:bg-destructive/10 hover:border-destructive/50 transition-all duration-300" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-5 h-5 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Center & Right Columns */}
          <div className={`lg:col-span-2 space-y-6 transition-all duration-1000 delay-400 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Points Progress */}
            <Card className="p-8 space-y-6 hover:shadow-eco-lg transition-all duration-500 border-2 hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                    <TrendingUp className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">Learning Progress</h3>
                </div>
                <Badge variant="default" className="text-lg px-6 py-2 bg-gradient-to-r from-primary to-accent shadow-eco">
                  {userData.ecoPoints} / {userData.maxPoints}
                </Badge>
              </div>
              <div className="space-y-3">
                <Progress value={progressPercentage} className="h-4" />
                <div className="flex justify-between text-sm">
                  <p className="text-muted-foreground">
                    {Math.round(progressPercentage)}% Complete
                  </p>
                  <p className="text-muted-foreground font-semibold">
                    {userData.maxPoints - userData.ecoPoints} points to go!
                  </p>
                </div>
              </div>
            </Card>

            {/* Achievements Section */}
            <Card className="p-8 space-y-6 hover:shadow-eco-lg transition-all duration-500 border-2 hover:border-accent/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-eco">
                  <Trophy className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {userData.achievements.length > 0 ? userData.achievements.map((achievement, index) => (
                  <div
                    key={achievement.id}
                    className={`group flex flex-col items-center space-y-3 transition-all duration-500 delay-${index * 100}`}
                  >
                    <div className={`
                      relative w-28 h-28 rounded-2xl flex items-center justify-center text-5xl
                      transition-all duration-500
                      ${achievement.earned 
                        ? achievement.color + ' shadow-eco-lg hover:scale-110 cursor-pointer hover:-rotate-6' 
                        : 'bg-muted/50 opacity-40 grayscale hover:opacity-60'}
                    `}>
                      {achievement.earned && (
                        <div className={`absolute inset-0 rounded-2xl ${achievement.color} blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                      )}
                      <span className="relative">{achievement.icon}</span>
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12 space-y-4">
                    <div className="w-20 h-20 mx-auto rounded-full bg-muted/30 flex items-center justify-center">
                      <Trophy className="w-10 h-10 text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground font-medium">Complete levels to earn achievements!</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Completed Topics */}
            <Card className="p-8 space-y-6 hover:shadow-eco-lg transition-all duration-500 border-2 hover:border-primary/30">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                  <Target className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Topic Progress</h2>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'e-waste', name: 'E-Waste Recycling' },
                  { id: 'temperature-change', name: 'Temperature Change' }
                ].map((topic, index) => {
                  const topicData = userData.topicProgress?.[topic.id];
                  let completedLessons = 0;
                  let completedLevels = 0;
                  
                  if (topicData) {
                    Object.values(topicData).forEach(lessons => {
                      const lessonCount = typeof lessons === 'number' ? lessons : 0;
                      completedLessons += lessonCount;
                      if (lessonCount >= 5) completedLevels++;
                    });
                  }
                  
                  const totalLessons = 50; // 10 levels * 5 lessons
                  const isTopicCompleted = completedLevels === 10;
                  const topicProgress = (completedLessons / totalLessons) * 100;
                  
                  return (
                    <div 
                      key={topic.id} 
                      className={`space-y-2 transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
                    >
                      <div className={`
                        group p-5 rounded-xl border-2 transition-all duration-500 hover:-translate-y-1
                        ${isTopicCompleted 
                          ? 'border-accent bg-gradient-to-br from-accent/10 to-accent/5 hover:shadow-eco hover:border-accent' 
                          : 'border-border bg-gradient-to-br from-muted/30 to-muted/10 hover:border-primary/30'}
                      `}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`
                            w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                            ${isTopicCompleted 
                              ? 'bg-gradient-to-br from-accent to-primary shadow-eco group-hover:scale-110' 
                              : 'bg-muted group-hover:bg-muted-foreground/20'}
                          `}>
                            {isTopicCompleted ? (
                              <CheckCircle2 className="w-6 h-6 text-primary-foreground" />
                            ) : (
                              <Circle className="w-6 h-6 text-muted-foreground" />
                            )}
                          </div>
                          <div className="flex-1">
                            <span className={`
                              text-lg font-bold transition-colors
                              ${isTopicCompleted ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground'}
                            `}>
                              {topic.name}
                            </span>
                            <p className="text-sm text-muted-foreground mt-0.5">
                              {completedLessons}/{totalLessons} lessons • {completedLevels}/10 levels
                            </p>
                          </div>
                          <Badge variant={isTopicCompleted ? "default" : "outline"} className={isTopicCompleted ? "bg-gradient-to-r from-accent to-primary" : ""}>
                            {Math.round(topicProgress)}%
                          </Badge>
                        </div>
                        <Progress value={topicProgress} className="h-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
