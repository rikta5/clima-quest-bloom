import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProgress } from "@/hooks/useUserProgress";
import { useTopics } from "@/hooks/useTopics";
import { Mail, User, CheckCircle2, Circle, LogOut, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { user: authUser, logout } = useAuth();
  const { userData, loading } = useUserProgress();
  const { topics } = useTopics();
  const navigate = useNavigate();

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

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            My Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your progress and achievements
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - User Info */}
          <Card className="p-6 space-y-6 lg:col-span-1">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32 border-4 border-primary shadow-eco-lg">
                <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                  {avatarInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User size={16} />
                    Name
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-foreground font-medium">{userData.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-foreground font-medium">{userData.email}</p>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </Card>

          {/* Center & Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements Section */}
            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Awards / Achievements</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {userData.achievements.length > 0 ? userData.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center space-y-3"
                  >
                    <div className={`
                      w-24 h-24 rounded-full flex items-center justify-center text-4xl
                      transition-all duration-300
                      ${achievement.earned 
                        ? achievement.color + ' shadow-eco-lg hover:scale-110 cursor-pointer' 
                        : 'bg-muted/50 opacity-40 grayscale'}
                    `}>
                      {achievement.icon}
                    </div>
                    <div className="text-center">
                      <p className={`text-sm font-bold ${achievement.earned ? 'text-foreground' : 'text-muted-foreground'}`}>
                        {achievement.name}
                      </p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    Complete levels to earn achievements!
                  </div>
                )}
              </div>
            </Card>

            {/* Points Progress */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Progress</h3>
                <Badge variant="default" className="text-base px-4 py-1.5">
                  {userData.ecoPoints} / {userData.maxPoints} Points
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                {userData.maxPoints - userData.ecoPoints} points until next milestone
              </p>
            </Card>

            {/* Completed Topics */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Completed Topics</h2>
              
              <div className="space-y-4">
                {topics.map((topic) => {
                  const completedLevels = topic.levels?.filter(l => 
                    userData.levelProgress[l.id] === "completed"
                  ).length || 0;
                  const totalLevels = topic.levels?.length || 0;
                  const isTopicCompleted = totalLevels > 0 && completedLevels === totalLevels;
                  
                  return (
                    <div key={topic.id} className="space-y-2">
                      <div className={`
                        flex items-center gap-3 p-3 rounded-lg border transition-all
                        ${isTopicCompleted 
                          ? 'border-accent bg-accent/5 hover:bg-accent/10' 
                          : 'border-border bg-muted/30'}
                      `}>
                        {isTopicCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <span className={`
                            font-medium
                            ${isTopicCompleted ? 'text-foreground' : 'text-muted-foreground'}
                          `}>
                            {topic.name}
                          </span>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {completedLevels} / {totalLevels} levels completed
                          </p>
                        </div>
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
