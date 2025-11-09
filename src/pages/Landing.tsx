import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Leaf, Target, TrendingUp, Users, Award, Zap, ArrowRight, Sparkles, Play, BookOpen, Trophy, BarChart3 } from "lucide-react";
import birdLogo from "@/assets/bird-logo.png";
import { useAuth } from "@/contexts/AuthContext";

const Landing = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    
    // Redirect authenticated users to home
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Target,
      title: "Interactive Learning",
      description: "Engage with gamified climate lessons and challenges",
      color: "from-primary to-accent"
    },
    {
      icon: TrendingUp,
      title: "Track Progress",
      description: "Monitor your learning journey and eco-points",
      color: "from-accent to-primary"
    },
    {
      icon: Award,
      title: "Earn Achievements",
      description: "Unlock badges as you master climate topics",
      color: "from-primary to-accent"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Learn together with climate-conscious learners",
      color: "from-accent to-primary"
    }
  ];

  const stats = [
    { label: "Topics Covered", value: "20+", icon: Leaf },
    { label: "Active Learners", value: "10K+", icon: Users },
    { label: "Success Rate", value: "94%", icon: TrendingUp },
    { label: "CO₂ Awareness", value: "100%", icon: Zap }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/10 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse delay-500" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4 border-b border-border/50 backdrop-blur-sm bg-background/80">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={birdLogo} alt="ClimaQuest Bird" className="w-12 h-12 animate-bounce-slow drop-shadow-lg" />
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ClimaQuest
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth">
              <Button variant="ghost" className="hover:bg-primary/10">
                Sign In
              </Button>
            </Link>
            <Link to="/auth">
              <Button className="bg-gradient-to-r from-primary to-accent hover:shadow-eco-lg transition-all">
                Get Started
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent">Learn. Act. Impact.</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Master{" "}
                <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
                  Climate Action
                </span>
                {" "}Through Play
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed">
                Join thousands of learners on an interactive journey to understand climate change, 
                earn rewards, and become a climate champion. Your adventure starts here.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth">
                  <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-eco-lg transition-all text-lg h-14 px-8">
                    Start Learning Free
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-lg h-14 px-8 hover:bg-primary/5">
                  Watch Demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                {stats.map((stat, index) => (
                  <div 
                    key={stat.label}
                    className={`text-center transition-all duration-700 delay-${index * 100} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                  >
                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Content - Bird Hero */}
            <div className={`relative transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <div className="relative">
                {/* Glowing Background */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 blur-3xl rounded-full animate-pulse" />
                
                {/* Bird Image */}
                <img 
                  src={birdLogo} 
                  alt="ClimaQuest Mascot" 
                  className="relative w-full max-w-md mx-auto drop-shadow-2xl animate-float"
                />

                {/* Floating Elements */}
                <div className="absolute top-10 -left-10 animate-bounce-slow delay-100">
                  <div className="w-16 h-16 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center shadow-eco">
                    <Leaf className="w-8 h-8 text-accent" />
                  </div>
                </div>
                
                <div className="absolute bottom-20 -right-10 animate-bounce-slow delay-300">
                  <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-sm flex items-center justify-center shadow-eco">
                    <Zap className="w-8 h-8 text-primary" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your journey to becoming a climate champion in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 relative">
            {/* Connecting Lines */}
            <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-gradient-to-r from-primary/20 via-accent/40 to-primary/20" />
            
            {/* Step 1 */}
            <div className={`relative transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card relative z-10">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-eco animate-pulse">
                    1
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 mt-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                    <Play className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-foreground">Start Your Journey</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Sign up for free and choose your first climate topic to explore
                  </p>
                </div>
              </Card>
              <div className="hidden md:block absolute -right-4 top-24 text-accent animate-bounce-slow">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 2 */}
            <div className={`relative transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-2 border-2 hover:border-accent/50 bg-card relative z-10">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-eco animate-pulse delay-100">
                    2
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 mt-6 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-eco">
                    <BookOpen className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-foreground">Learn & Play</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Complete interactive lessons, watch reels, and take on challenges
                  </p>
                </div>
              </Card>
              <div className="hidden md:block absolute -right-4 top-24 text-primary animate-bounce-slow delay-100">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 3 */}
            <div className={`relative transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-2 border-2 hover:border-primary/50 bg-card relative z-10">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-eco animate-pulse delay-200">
                    3
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 mt-6 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-eco">
                    <Trophy className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-foreground">Earn Rewards</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Collect eco-points, unlock badges, and build your streak
                  </p>
                </div>
              </Card>
              <div className="hidden md:block absolute -right-4 top-24 text-accent animate-bounce-slow delay-200">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>

            {/* Step 4 */}
            <div className={`relative transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <Card className="p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-2 border-2 hover:border-accent/50 bg-card relative z-10">
                <div className="relative">
                  <div className="absolute -top-3 -left-3 w-12 h-12 rounded-full bg-gradient-to-br from-accent to-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-eco animate-pulse delay-300">
                    4
                  </div>
                  <div className="w-16 h-16 mx-auto mb-4 mt-6 rounded-2xl bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-eco">
                    <BarChart3 className="w-8 h-8 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-center text-foreground">Track Progress</h3>
                  <p className="text-muted-foreground text-center text-sm">
                    Monitor your learning journey and see your climate impact grow
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Visual Flow Indicator - Mobile */}
          <div className="md:hidden flex justify-center mt-8 space-x-2">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse delay-100" />
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse delay-200" />
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse delay-300" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Why Choose ClimaQuest?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience climate education like never before with our interactive platform
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card 
                key={feature.title}
                className={`p-6 hover:shadow-eco-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer border-2 hover:border-primary/50 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-eco`}>
                  <feature.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary/20 shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10" />
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground">
                Ready to Make a Difference?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join our community of climate champions and start your learning journey today.
              </p>
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:shadow-eco-lg transition-all text-lg h-14 px-12">
                  Start Your Journey
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-8 border-t border-border/50 backdrop-blur-sm bg-card/50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2025 ClimaQuest. Making climate education accessible for everyone.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
