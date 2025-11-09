import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { findLevelById, getNextLevel } from "@/config/levelsConfig";
import { ArrowLeft, CheckCircle2, XCircle, Sparkles, ArrowRight, Lock, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EcoPointsBadge } from "@/components/EcoPointsBadge";
import { LevelTransition } from "@/components/LevelTransition";
import { useLevelProgress } from "@/hooks/useLevelProgress";
import { toast } from "sonner";

const LevelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const levelId = parseInt(id || "1");
  const { userData, getLevelStatus, completeLevel } = useLevelProgress();
  
  const level = findLevelById(levelId);
  const nextLevel = level ? getNextLevel(levelId) : undefined;
  const currentStatus = getLevelStatus(levelId);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showTransition, setShowTransition] = useState(false);

  if (!level) {
    return (
      <MainLayout>
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Level not found</h1>
          <Button onClick={() => navigate("/levels")}>
            Back to Levels
          </Button>
        </div>
      </MainLayout>
    );
  }

  const isLocked = currentStatus === "locked";
  const isCompleted = currentStatus === "completed";
  const isCorrect = selectedAnswer === level.quiz?.correctAnswer;

  const handleAnswerClick = async (answerIndex: number) => {
    if (showFeedback || isCompleted) return;
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    if (answerIndex === level.quiz?.correctAnswer && !isCompleted) {
      await completeLevel(levelId, 10);
      toast.success("Level completed! +10 points 🎉");
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
  };

  const handleNextLevel = () => {
    if (nextLevel) {
      setShowTransition(true);
    }
  };

  const handleTransitionComplete = () => {
    if (nextLevel) {
      navigate(`/levels/${nextLevel.id}`);
    }
  };

  const getAnswerButtonStyle = (answerIndex: number) => {
    if (!showFeedback) {
      return "bg-card hover:bg-muted border-2 border-border hover:border-primary";
    }
    
    if (answerIndex === level.quiz?.correctAnswer) {
      return "bg-accent/20 border-2 border-accent text-accent-foreground";
    }
    
    if (answerIndex === selectedAnswer && answerIndex !== level.quiz?.correctAnswer) {
      return "bg-destructive/20 border-2 border-destructive text-destructive";
    }
    
    return "bg-muted/50 border-2 border-border opacity-50";
  };

  return (
    <MainLayout>
      {showTransition && <LevelTransition onComplete={handleTransitionComplete} />}
      
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between animate-fade-in">
          <Button
            variant="outline"
            onClick={() => navigate("/levels")}
            className="gap-2 hover:scale-105 transition-transform"
          >
            <ArrowLeft size={16} />
            Back to Levels
          </Button>
          
          {userData && (
            <div className="flex items-center gap-3 bg-gradient-to-r from-primary/10 to-accent/10 px-4 py-2 rounded-full border border-primary/20">
              <Sparkles className="w-5 h-5 text-orange animate-pulse" />
              <EcoPointsBadge points={userData.ecoPoints} size="md" />
            </div>
          )}
        </div>

        {/* Level Header with gradient background */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/20 via-accent/10 to-transparent border border-primary/20 p-8 animate-fade-in">
          <div className="absolute inset-0 bg-grid-white/5" />
          <div className="relative text-center space-y-4">
            <Badge className="text-base px-6 py-2 bg-primary/90 backdrop-blur">
              <BookOpen className="w-4 h-4 mr-2 inline" />
              Level {level.id}
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              {level.title}
            </h1>
            {isCompleted && (
              <Badge className="text-sm px-4 py-2 bg-accent/90 backdrop-blur">
                <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {isLocked ? (
          <Card className="p-16 text-center space-y-6 bg-gradient-to-br from-muted/50 to-muted/20 border-2 border-dashed border-muted-foreground/30 animate-fade-in">
            <div className="w-24 h-24 bg-gradient-to-br from-muted to-muted/50 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Lock className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-foreground">Level Locked</h2>
              <p className="text-muted-foreground max-w-md mx-auto text-lg">
                Complete previous levels to unlock this content and continue your climate learning journey.
              </p>
            </div>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/levels")}
              className="gap-2"
            >
              <ArrowLeft size={16} />
              Go Back
            </Button>
          </Card>
        ) : (
          <>
            {/* Educational Content */}
            <Card className="p-10 bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/10 shadow-eco-lg animate-fade-in">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Learn</h2>
              </div>
              <div className="prose prose-green max-w-none">
                <p className="text-foreground leading-relaxed text-lg">
                  {level.content}
                </p>
              </div>
            </Card>

            {/* Quiz Section */}
            {level.quiz && (
              <Card className="p-10 space-y-8 bg-gradient-to-br from-card via-card to-accent/5 border-2 border-accent/10 shadow-eco-lg animate-fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-orange flex items-center justify-center">
                      <span className="text-accent-foreground font-bold">?</span>
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Test Your Knowledge</h2>
                  </div>
                  {showFeedback && !isCorrect && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetQuiz}
                      className="hover:scale-105 transition-transform"
                    >
                      Try Again
                    </Button>
                  )}
                </div>

                <div className="bg-muted/30 p-6 rounded-xl border border-muted">
                  <p className="text-xl text-foreground font-semibold leading-relaxed">
                    {level.quiz.question}
                  </p>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {level.quiz.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showFeedback}
                      className={`
                        group relative p-6 rounded-xl text-left transition-all duration-300
                        ${getAnswerButtonStyle(index)}
                        ${!showFeedback && 'hover:scale-[1.03] hover:shadow-eco'}
                        disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-start gap-4">
                        <div className={`
                          w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg
                          transition-all duration-300
                          ${showFeedback && index === level.quiz.correctAnswer ? 'bg-accent text-accent-foreground shadow-eco' : 
                            showFeedback && index === selectedAnswer ? 'bg-destructive text-destructive-foreground' : 
                            'bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground'}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-foreground font-medium flex-1 pt-1.5 text-lg">
                          {answer}
                        </span>
                        {showFeedback && index === level.quiz.correctAnswer && (
                          <CheckCircle2 className="w-7 h-7 text-accent flex-shrink-0 mt-1 animate-scale-in" />
                        )}
                        {showFeedback && index === selectedAnswer && index !== level.quiz.correctAnswer && (
                          <XCircle className="w-7 h-7 text-destructive flex-shrink-0 mt-1 animate-scale-in" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={`
                    p-8 rounded-xl border-2 animate-fade-in shadow-lg
                    ${isCorrect 
                      ? 'bg-gradient-to-br from-accent/20 to-accent/5 border-accent' 
                      : 'bg-gradient-to-br from-destructive/20 to-destructive/5 border-destructive'}
                  `}>
                    <div className="flex items-start gap-4">
                      {isCorrect ? (
                        <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0 shadow-eco">
                          <CheckCircle2 className="w-7 h-7 text-accent-foreground" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-destructive flex items-center justify-center flex-shrink-0">
                          <XCircle className="w-7 h-7 text-destructive-foreground" />
                        </div>
                      )}
                      <div className="flex-1 space-y-3">
                        <p className={`font-bold text-2xl ${isCorrect ? 'text-accent' : 'text-destructive'}`}>
                          {isCorrect ? 'Excellent Work! 🎉' : 'Not quite right!'}
                        </p>
                        {isCorrect && (
                          <p className="text-foreground text-lg leading-relaxed">
                            You just earned <span className="font-bold text-accent">+10 EcoPoints</span>! {level.quiz.explanation}
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="text-foreground text-lg">
                            Take another look at the content above and try again. You can do it!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Next Level Button */}
                {showFeedback && isCorrect && nextLevel && (
                  <div className="pt-4 animate-fade-in">
                    <Button 
                      onClick={handleNextLevel}
                      size="lg"
                      className="w-full gap-3 h-16 text-lg shadow-eco-lg hover:shadow-eco hover:scale-[1.02] transition-all bg-gradient-to-r from-primary to-accent"
                    >
                      Continue to Next Level: {nextLevel.title}
                      <ArrowRight size={24} className="animate-pulse" />
                    </Button>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default LevelDetail;
