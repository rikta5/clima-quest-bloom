import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, TrendingUp, Leaf } from "lucide-react";
import { ReelPlayer } from "@/components/ReelPlayer";
import { useState } from "react";
import reelVertical from "@/assets/reel-vertical.png";
import reelRenewableEnergy from "@/assets/reel-renewable-energy.jpg";
import reelOceanVertical from "@/assets/reel-ocean-vertical.jpg";

const Reels = () => {
  const [selectedReel, setSelectedReel] = useState<string | null>(null);
  const [reelTitle, setReelTitle] = useState("");

  const handleReelClick = (videoUrl: string, title: string) => {
    setSelectedReel(videoUrl);
    setReelTitle(title);
  };

  const sampleReels = [
    {
      id: 1,
      title: "Arctic Ice Melt Crisis",
      fact: "Arctic sea ice is declining at a rate of 13% per decade",
      views: "12.5K",
      duration: "0:45",
      category: "Climate Science"
    },
    {
      id: 2,
      title: "Renewable Energy Growth",
      fact: "Solar power capacity grew by 23% globally last year",
      views: "8.3K",
      duration: "1:00",
      category: "Solutions",
      thumbnail: reelRenewableEnergy
    },
    {
      id: 3,
      title: "Ocean Acidification",
      fact: "Ocean pH has dropped by 0.1 units since pre-industrial times",
      views: "15.2K",
      duration: "0:52",
      category: "Ocean Conservation",
      thumbnail: reelOceanVertical
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>AI-Generated Climate Content</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Educational Reels
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Bite-sized climate facts and insights, automatically generated from trusted climate datasets
          </p>
        </div>

        {/* Featured Reel - Large Vertical Card */}
        <div className="max-w-md mx-auto">
          <Card 
            className="overflow-hidden group cursor-pointer hover:shadow-eco-lg transition-all"
            onClick={() => handleReelClick("https://www.w3schools.com/html/mov_bbb.mp4", sampleReels[0].title)}
          >
            <div className="relative aspect-[9/16] bg-black">
              <img 
                src={reelVertical} 
                alt="Climate Reel" 
                className="w-full h-full object-cover"
              />
              
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              
              {/* Play Button */}
              <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Play className="w-10 h-10 text-primary fill-primary ml-2" />
              </button>

              {/* Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge className="bg-primary text-primary-foreground">
                    Featured
                  </Badge>
                  <Badge variant="outline" className="bg-black/50 text-white border-white/20">
                    {sampleReels[0].category}
                  </Badge>
                </div>
                
                <h2 className="text-2xl font-bold text-white">
                  {sampleReels[0].title}
                </h2>
                
                <div className="bg-primary/20 backdrop-blur-sm border border-primary/30 rounded-lg p-4">
                  <p className="text-white font-medium text-lg">
                    "{sampleReels[0].fact}"
                  </p>
                </div>

                <div className="flex items-center justify-between text-white/80 text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4" />
                      {sampleReels[0].views} views
                    </span>
                    <span>{sampleReels[0].duration}</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Info Card */}
          <Card className="mt-4 p-4 bg-accent/5 border-accent/20">
            <div className="flex items-start gap-3">
              <Leaf className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Auto-Generated Content</p>
                <p>
                  These reels are automatically created from verified climate datasets using AI. 
                  Each reel presents scientific facts in an engaging, easy-to-understand format.
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* More Reels Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-foreground text-center">More Climate Reels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {sampleReels.slice(1).map((reel) => (
              <Card 
                key={reel.id} 
                className="overflow-hidden group cursor-pointer hover:shadow-eco-lg transition-all"
                onClick={() => handleReelClick("https://www.w3schools.com/html/mov_bbb.mp4", reel.title)}
              >
                <div className="relative aspect-[9/16] bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  {reel.thumbnail && (
                    <img 
                      src={reel.thumbnail} 
                      alt={reel.title} 
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  )}
                  {!reel.thumbnail && <Play className="w-16 h-16 text-muted-foreground/50" />}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  
                  <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg z-10">
                    <Play className="w-8 h-8 text-primary fill-primary ml-1" />
                  </button>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                    <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                      {reel.category}
                    </Badge>
                    <h3 className="text-white font-bold line-clamp-2">
                      {reel.title}
                    </h3>
                    <p className="text-white/80 text-sm line-clamp-2">
                      {reel.fact}
                    </p>
                    <div className="flex items-center justify-between text-white/60 text-xs">
                      <span>{reel.views} views</span>
                      <span>{reel.duration}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        <ReelPlayer
          isOpen={selectedReel !== null}
          onClose={() => setSelectedReel(null)}
          videoUrl={selectedReel || ""}
          title={reelTitle}
        />
      </div>
    </MainLayout>
  );
};

export default Reels;
