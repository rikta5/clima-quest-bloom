import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { EcoPointsBadge } from "@/components/EcoPointsBadge";
import { StreakBadge } from "@/components/StreakBadge";
import { MiniLevelPath } from "@/components/MiniLevelPath";
import { ReelCard } from "@/components/ReelCard";
import { ReelPlayer } from "@/components/ReelPlayer";
import { useUserProgress } from "@/hooks/useUserProgress";
import { Sparkles, Play, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import mascotImage from "@/assets/mascot-bird.png";
import reelThumbnail from "@/assets/reel-thumbnail.png";
import reelArcticIce from "@/assets/reel-arctic-ice.jpg";
import reelOceanAcidification from "@/assets/reel-ocean-acidification.jpg";
import partnerAd1 from "@/assets/partner-ad-1.jpg";
import partnerAd2 from "@/assets/partner-ad-2.jpg";

const Index = () => {
  const { userData, loading } = useUserProgress();
  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  const [reelTitle, setReelTitle] = useState("");

  const handleReelClick = (videoUrl: string, title: string) => {
    setSelectedReel(videoUrl);
    setReelTitle(title);
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
          <p className="text-muted-foreground">Unable to load user data</p>
        </div>
      </MainLayout>
    );
  }

  const avatarInitials = userData.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const streak = userData.streak || 0;

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Main 3-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Mascot & Brand */}
          <Card className="lg:col-span-3 p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-48 h-48 flex items-center justify-center">
              <img 
                src={mascotImage} 
                alt="ClimaQuest Mascot - Climat the Bird" 
                className="w-full h-full object-contain animate-liquid-float drop-shadow-xl"
              />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
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
                <Avatar className="w-16 h-16 border-2 border-white/50 shadow-glass glass rounded-full">
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
                    {avatarInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col sm:flex-row gap-2">
                  <EcoPointsBadge points={userData.ecoPoints} size="lg" />
                  <StreakBadge days={streak} size="lg" />
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
              Eco Partners
            </h3>
            <div className="space-y-3">
              <div className="aspect-square rounded-2xl overflow-hidden glass hover:shadow-glass-lg transition-all duration-300 cursor-pointer group">
                <img 
                  src={partnerAd1} 
                  alt="Eco-friendly Electric Vehicles Partner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="aspect-square rounded-2xl overflow-hidden glass hover:shadow-glass-lg transition-all duration-300 cursor-pointer group">
                <img 
                  src={partnerAd2} 
                  alt="Renewable Energy Solutions Partner" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <ReelCard
                title="The Future of Renewable Energy"
                thumbnail={reelThumbnail}
                category="Featured"
                duration="3:45"
                views="45.2K"
                fact="Discover how solar and wind power are transforming our world"
                featured
                onClick={() => handleReelClick("/videos/reel-1.mp4", "The Future of Renewable Energy")}
              />
            </div>
            
            <div className="md:col-span-1 flex flex-col gap-6">
              <ReelCard
                title="Arctic Ice Melt Crisis"
                thumbnail={reelArcticIce}
                category="Climate Science"
                duration="0:45"
                views="12.5K"
                fact="Arctic sea ice is declining at a rate of 13% per decade"
                onClick={() => handleReelClick("/videos/reel-2.mp4", "Arctic Ice Melt Crisis")}
              />
              
              <ReelCard
                title="Ocean Acidification"
                thumbnail={reelOceanAcidification}
                category="Ocean Conservation"
                duration="0:52"
                views="15.2K"
                fact="Ocean pH has dropped by 0.1 units since pre-industrial times"
                onClick={() => handleReelClick("/videos/reel-3.mp4", "Ocean Acidification")}
              />
            </div>
          </div>
          
          <ReelPlayer
            isOpen={selectedReel !== null}
            onClose={() => setSelectedReel(null)}
            videoUrl={selectedReel || ""}
            title={reelTitle}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
