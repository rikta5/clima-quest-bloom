import { Link, useLocation } from "react-router-dom";
import { Home, Target, User, Film, BookOpen } from "lucide-react";
import { EcoPointsBadge } from "./EcoPointsBadge";
import { StreakBadge } from "./StreakBadge";
import { useUserProgress } from "@/hooks/useUserProgress";
import mascotLogo from "@/assets/mascot-bird.png";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const location = useLocation();
  const { userData } = useUserProgress();
  
  const ecoPoints = userData?.ecoPoints || 0;
  const streak = userData?.streak || 0;

  const navItems = [
    { to: "/home", icon: Home, label: "Home" },
    { to: "/levels", icon: Target, label: "Levels" },
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/reels", icon: Film, label: "Reels" },
    { to: "/workflows", icon: BookOpen, label: "Docs" },
  ];

  const isActive = (path: string) => {
    if (path === "/home") {
      return location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="w-10 h-10 flex items-center justify-center transition-transform group-hover:scale-110">
                <img 
                  src={mascotLogo} 
                  alt="ClimaQuest Logo" 
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                ClimaQuest
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    isActive(item.to)
                      ? "bg-primary text-primary-foreground shadow-eco"
                      : "text-foreground hover:bg-muted hover:text-primary"
                  }`}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Points & Streak */}
            <div className="flex items-center gap-3">
              <EcoPointsBadge points={ecoPoints} />
              <StreakBadge days={streak} />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t border-border shadow-lg">
        <div className="flex items-center justify-around px-2 py-3">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-lg transition-all ${
                isActive(item.to)
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-primary hover:bg-muted"
              }`}
            >
              <item.icon size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};
