import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EcoPointsBadge } from "@/components/EcoPointsBadge";
import { StreakBadge } from "@/components/StreakBadge";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Target } from "lucide-react";

const Profile = () => {
  // Mock data
  const user = {
    name: "Climate Champion",
    initials: "CC",
    level: 3,
    ecoPoints: 1250,
    streak: 7,
    achievements: [
      { icon: Trophy, name: "First Steps", color: "text-orange" },
      { icon: Award, name: "Week Warrior", color: "text-blue" },
      { icon: Target, name: "Level Master", color: "text-accent" },
    ]
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        <Card className="p-8">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <Avatar className="w-24 h-24 border-4 border-primary shadow-eco-lg">
              <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                {user.initials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Badge variant="default" className="text-sm px-4 py-1">
                  Level {user.level}
                </Badge>
                <EcoPointsBadge points={user.ecoPoints} size="lg" />
                <StreakBadge days={user.streak} size="lg" />
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {user.achievements.map((achievement, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-eco-lg transition-all">
                <achievement.icon className={`w-12 h-12 mx-auto mb-3 ${achievement.color}`} />
                <h3 className="font-semibold text-foreground">{achievement.name}</h3>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
