import { MainLayout } from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Leaf, Target, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <MainLayout>
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Leaf className="w-4 h-4" />
            <span>Start Your Climate Journey Today</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground text-balance leading-tight">
            Learn Climate Action
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Through Play
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Master sustainability concepts through interactive levels, earn eco-points, 
            and make a real difference in the world.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link to="/levels">
              <Button size="lg" className="gap-2 shadow-eco-lg hover:shadow-eco hover:scale-105 transition-all">
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/workflows">
              <Button variant="outline" size="lg" className="gap-2">
                View Documentation
              </Button>
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-eco-lg transition-all">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-4 shadow-eco">
              <Target className="w-6 h-6 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Progressive Levels</h3>
            <p className="text-muted-foreground">
              Advance through carefully designed levels that build your climate knowledge step by step.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-eco-lg transition-all">
            <div className="w-12 h-12 bg-accent rounded-xl flex items-center justify-center mb-4 shadow-eco">
              <Leaf className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Earn Eco-Points</h3>
            <p className="text-muted-foreground">
              Complete challenges and maintain your streak to earn points and unlock achievements.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-eco-lg transition-all">
            <div className="w-12 h-12 bg-orange rounded-xl flex items-center justify-center mb-4 shadow-eco">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Track Progress</h3>
            <p className="text-muted-foreground">
              Monitor your achievements and see how you're contributing to climate action.
            </p>
          </Card>
        </section>
      </div>
    </MainLayout>
  );
};

export default Index;
