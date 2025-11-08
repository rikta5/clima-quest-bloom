import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EcoPointsBadge } from "@/components/EcoPointsBadge";
import { StreakBadge } from "@/components/StreakBadge";
import { MiniLevelPath } from "@/components/MiniLevelPath";
import { Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import mascotImage from "@/assets/mascot.png";
import reelThumbnail from "@/assets/reel-thumbnail.png";

const Index = () => {
  // Mock data - will be replaced with real data later
  const userData = {
    initials: "CC",
    ecoPoints: 32,
    streak: 5,
  };

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Mascot & Brand */}
          <Card className="lg:col-span-3 p-6 flex flex-col items-center text-center space-y-4 hover:shadow-eco-lg transition-all">
            <div className="w-40 h-40 rounded-full bg-secondary/30 p-4 flex items-center justify-center">
              <img 
                src={mascotImage} 
                alt="ClimaQuest Mascot" 
                className="w-full h-full object-contain animate-bounce-slow"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ClimaQuest
              </h2>
              <p className="text-sm text-muted-foreground">
                Your journey to climate action starts here
              </p>
            </div>
          </Card>

          {/* Center Column - Play Area */}
          <Card className="lg:col-span-6 p-6 space-y-6">
            {/* User Info Row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar className="w-16 h-16 border-4 border-primary shadow-eco">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {userData.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row gap-2">
                  <EcoPointsBadge points={userData.ecoPoints} size="lg" />
                  <StreakBadge days={userData.streak} size="lg" />
                </div>
              </div>
            </div>

            {/* Mini Level Path */}
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm font-semibold text-muted-foreground">
                <Sparkles className="w-4 h-4" />
                <span>Your Progress</span>
              </div>
              <MiniLevelPath />
            </div>
          </Card>

          {/* Right Column - Eco Ads */}
          <Card className="lg:col-span-3 p-6 space-y-4">
            <h3 className="text-lg font-bold text-center text-foreground">
              Eco Ads / Partners
            </h3>
            <div className="space-y-3">
              <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground text-center p-4">
                Partner Ad Slot 1
              </div>
              <div className="aspect-square rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center text-xs text-muted-foreground text-center p-4">
                Partner Ad Slot 2
              </div>
            </div>
          </Card>
        </div>

        {/* Educational Reels Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Educational Reels</h2>
            <Link 
              to="/reels" 
              className="text-primary hover:text-accent font-semibold text-sm flex items-center gap-1 transition-colors"
            >
              View All
              <Play className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Featured Reel */}
            <Card className="md:col-span-2 lg:col-span-2 overflow-hidden group cursor-pointer hover:shadow-eco-lg transition-all">
              <div className="relative aspect-video">
                <img 
                  src={reelThumbnail} 
                  alt="Renewable Energy Reel" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="bg-primary px-3 py-1 rounded-full text-xs font-semibold">
                      Featured
                    </span>
                    <span className="text-xs opacity-90">3:45</span>
                  </div>
                  <h3 className="text-xl font-bold">The Future of Renewable Energy</h3>
                  <p className="text-sm opacity-90">
                    Discover how solar and wind power are transforming our world
                  </p>
                </div>
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                  <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                </button>
              </div>
            </Card>

            {/* Placeholder Reels */}
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden group cursor-pointer hover:shadow-eco-lg transition-all lg:col-span-1 md:col-span-1">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  <Play className="w-12 h-12 text-muted-foreground/50" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-white text-sm font-semibold">Coming Soon</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
