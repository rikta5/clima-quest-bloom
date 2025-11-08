import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { mockUser } from "@/config/mockUser";
import { Mail, Phone, User, CheckCircle2, Circle } from "lucide-react";

const Profile = () => {
  const user = mockUser;
  const progressPercentage = (user.ecoPoints / user.maxPoints) * 100;

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
                  {user.avatarInitials}
                </AvatarFallback>
              </Avatar>
              
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User size={16} />
                    Name
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-foreground font-medium">{user.name}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Mail size={16} />
                    Email
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-foreground font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Phone size={16} />
                    Phone
                  </label>
                  <div className="p-3 bg-muted/50 rounded-lg border border-border">
                    <p className="text-foreground font-medium">{user.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Center & Right Columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Achievements Section */}
            <Card className="p-6 space-y-6">
              <h2 className="text-2xl font-bold text-foreground">Awards / Achievements</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {user.achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`
                      relative p-4 rounded-xl text-center transition-all
                      transform rotate-45 overflow-hidden
                      ${achievement.earned ? achievement.color + ' shadow-eco-lg hover:scale-110' : 'opacity-50'}
                    `}
                  >
                    <div className="transform -rotate-45 space-y-1">
                      <div className="text-3xl">{achievement.icon}</div>
                      <p className="text-xs font-bold line-clamp-2">
                        {achievement.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Points Progress */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Progress</h3>
                <Badge variant="default" className="text-base px-4 py-1.5">
                  {user.ecoPoints} / {user.maxPoints} Points
                </Badge>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              <p className="text-sm text-muted-foreground text-center">
                {user.maxPoints - user.ecoPoints} points until next milestone
              </p>
            </Card>

            {/* Completed Topics */}
            <Card className="p-6 space-y-4">
              <h2 className="text-2xl font-bold text-foreground">Completed Topics</h2>
              
              <div className="space-y-3">
                {user.completedTopics.map((topic) => (
                  <div
                    key={topic.id}
                    className={`
                      flex items-center gap-3 p-3 rounded-lg border transition-all
                      ${topic.completed 
                        ? 'border-accent bg-accent/5 hover:bg-accent/10' 
                        : 'border-border bg-muted/30'}
                    `}
                  >
                    {topic.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-accent flex-shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span className={`
                      font-medium
                      ${topic.completed ? 'text-foreground' : 'text-muted-foreground'}
                    `}>
                      Level {topic.id}: {topic.name}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
