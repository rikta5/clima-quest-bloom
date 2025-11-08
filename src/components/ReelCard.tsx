import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, TrendingUp } from "lucide-react";

interface ReelCardProps {
  title: string;
  thumbnail?: string;
  category?: string;
  duration?: string;
  views?: string;
  fact?: string;
  featured?: boolean;
  onClick: () => void;
  className?: string;
}

export const ReelCard = ({
  title,
  thumbnail,
  category,
  duration,
  views,
  fact,
  featured,
  onClick,
  className = ""
}: ReelCardProps) => {
  return (
    <Card 
      className={`overflow-hidden group cursor-pointer hover:shadow-eco-lg transition-all ${className}`}
      onClick={onClick}
    >
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20">
        {thumbnail && (
          <img 
            src={thumbnail} 
            alt={title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
          <Play className="w-8 h-8 text-primary fill-primary ml-1" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {featured && (
              <Badge className="bg-primary text-primary-foreground text-xs">
                Featured
              </Badge>
            )}
            {category && (
              <Badge variant="outline" className="bg-black/50 text-white border-white/20 text-xs">
                {category}
              </Badge>
            )}
          </div>
          
          <h3 className="text-white font-bold text-lg line-clamp-2">
            {title}
          </h3>
          
          {fact && (
            <p className="text-white/90 text-sm line-clamp-2">
              {fact}
            </p>
          )}

          <div className="flex items-center justify-between text-white/80 text-xs">
            <div className="flex items-center gap-3">
              {views && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {views}
                </span>
              )}
              {duration && <span>{duration}</span>}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
