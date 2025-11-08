import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { ArrowRight, Database, Cpu, Layers, Film, Sparkles, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Workflows = () => {
  const dataWorkflowSteps = [
    {
      icon: Database,
      title: "Climate Datasets",
      description: "Trusted sources like NOAA, NASA, and IPCC",
      details: [
        "Temperature records",
        "CO2 measurements",
        "Sea level data",
        "Biodiversity metrics"
      ]
    },
    {
      icon: Layers,
      title: "Database Storage",
      description: "Structured topics & descriptions",
      details: [
        "Topic categorization",
        "Content organization",
        "Metadata tagging",
        "Version control"
      ]
    },
    {
      icon: Cpu,
      title: "AI Processing",
      description: "Intelligent content wrapper",
      details: [
        "Natural language processing",
        "Fact extraction",
        "Question generation",
        "Difficulty calibration"
      ]
    },
    {
      icon: Sparkles,
      title: "Learning Content",
      description: "Interactive levels & quizzes",
      details: [
        "Engaging questions",
        "Progressive difficulty",
        "Instant feedback",
        "Point rewards"
      ]
    }
  ];

  const reelWorkflowSteps = [
    {
      step: 1,
      title: "Data Analysis",
      description: "AI analyzes climate datasets to identify key insights and trends",
      icon: Database
    },
    {
      step: 2,
      title: "Script Generation",
      description: "N8N workflow generates engaging scripts highlighting important facts",
      icon: Film
    },
    {
      step: 3,
      title: "Visual Creation",
      description: "AI creates compelling visuals and animations to illustrate concepts",
      icon: Sparkles
    },
    {
      step: 4,
      title: "Reel Assembly",
      description: "Automated assembly of script, visuals, and audio into short-form content",
      icon: Zap
    }
  ];

  return (
    <MainLayout>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            How ClimaQuest Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Behind-the-scenes look at our data-driven learning platform
          </p>
        </div>

        {/* Data Acquisition Workflow */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-base px-4 py-2">
              Workflow 1
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Data Acquisition & Learning Content
            </h2>
          </div>

          <p className="text-muted-foreground text-lg max-w-3xl">
            Our platform transforms raw climate data into engaging educational experiences through an intelligent pipeline.
          </p>

          {/* Workflow Diagram */}
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {dataWorkflowSteps.map((step, index) => (
                <div key={index} className="relative">
                  <Card className="p-6 space-y-4 h-full hover:shadow-eco-lg transition-all">
                    <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-eco">
                      <step.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="text-lg font-bold text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>

                    <ul className="space-y-1.5">
                      {step.details.map((detail, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="text-primary mt-0.5">•</span>
                          <span className="text-muted-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>

                  {/* Arrow between cards */}
                  {index < dataWorkflowSteps.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                      <ArrowRight className="w-6 h-6 text-primary" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reel Generation Workflow */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Badge variant="default" className="text-base px-4 py-2 bg-orange text-white">
              Workflow 2
            </Badge>
            <h2 className="text-3xl font-bold text-foreground">
              Reel Generation Pipeline
            </h2>
          </div>

          <p className="text-muted-foreground text-lg max-w-3xl">
            Using N8N automation and AI, we convert climate insights into engaging short-form video content.
          </p>

          <Card className="p-8 bg-gradient-to-br from-orange/5 to-primary/5">
            <div className="space-y-6">
              {reelWorkflowSteps.map((step, index) => (
                <div key={index} className="flex gap-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 bg-orange rounded-full flex items-center justify-center text-white font-bold shadow-eco-lg flex-shrink-0">
                      {step.step}
                    </div>
                    {index < reelWorkflowSteps.length - 1 && (
                      <div className="w-0.5 h-full bg-border flex-1" />
                    )}
                  </div>

                  <Card className="flex-1 p-6 mb-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-orange/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <step.icon className="w-5 h-5 text-orange" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground">
                          {step.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </Card>

          {/* Technical Details */}
          <Card className="p-6 bg-muted/30">
            <h3 className="text-lg font-bold text-foreground mb-4">
              Technology Stack
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div className="space-y-2">
                <p className="font-semibold text-foreground">Automation</p>
                <ul className="space-y-1">
                  <li>• N8N workflow orchestration</li>
                  <li>• Scheduled data updates</li>
                  <li>• Automated quality checks</li>
                </ul>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-foreground">AI Processing</p>
                <ul className="space-y-1">
                  <li>• Natural language generation</li>
                  <li>• Image and video synthesis</li>
                  <li>• Content optimization</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default Workflows;
