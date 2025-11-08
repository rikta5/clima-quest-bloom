import { MainLayout } from "@/components/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate } from "react-router-dom";
import { findLevelById } from "@/config/levelsConfig";
import { ArrowLeft, CheckCircle2, XCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { EcoPointsBadge } from "@/components/EcoPointsBadge";

const LevelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const levelId = parseInt(id || "1");
  
  const level = findLevelById(levelId);
  
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [localEcoPoints, setLocalEcoPoints] = useState(0);

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

  const isLocked = level.status === "locked";
  const isCorrect = selectedAnswer === level.quiz?.correctAnswer;

  const handleAnswerClick = (answerIndex: number) => {
    if (showFeedback) return; // Prevent changing answer after selection
    
    setSelectedAnswer(answerIndex);
    setShowFeedback(true);
    
    // Award points if correct
    if (answerIndex === level.quiz?.correctAnswer) {
      setLocalEcoPoints(prev => prev + 10);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswer(null);
    setShowFeedback(false);
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
      <div className="space-y-6 max-w-4xl mx-auto">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate("/levels")}
            className="gap-2"
          >
            <ArrowLeft size={16} />
            Back to Levels
          </Button>
          
          {localEcoPoints > 0 && (
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-orange animate-pulse" />
              <EcoPointsBadge points={localEcoPoints} size="md" />
            </div>
          )}
        </div>

        {/* Level Header */}
        <div className="text-center space-y-2">
          <Badge variant="outline" className="text-sm px-4 py-1.5">
            Level {level.id}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            {level.title}
          </h1>
        </div>

        {isLocked ? (
          <Card className="p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
              <ArrowLeft className="w-8 h-8 text-muted-foreground rotate-180" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Level Locked</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Complete previous levels to unlock this content and continue your climate learning journey.
            </p>
          </Card>
        ) : (
          <>
            {/* Educational Content */}
            <Card className="p-8">
              <div className="prose prose-green max-w-none">
                <p className="text-foreground leading-relaxed text-lg">
                  {level.content}
                </p>
              </div>
            </Card>

            {/* Quiz Section */}
            {level.quiz && (
              <Card className="p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Question 1</h2>
                  {showFeedback && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetQuiz}
                    >
                      Try Again
                    </Button>
                  )}
                </div>

                <p className="text-lg text-foreground font-medium">
                  {level.quiz.question}
                </p>

                {/* Answer Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {level.quiz.answers.map((answer, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerClick(index)}
                      disabled={showFeedback}
                      className={`
                        p-4 rounded-xl text-left transition-all duration-300
                        ${getAnswerButtonStyle(index)}
                        ${!showFeedback && 'hover:scale-[1.02]'}
                        disabled:cursor-not-allowed
                      `}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold
                          ${showFeedback && index === level.quiz.correctAnswer ? 'bg-accent text-accent-foreground' : 
                            showFeedback && index === selectedAnswer ? 'bg-destructive text-destructive-foreground' : 
                            'bg-muted text-muted-foreground'}
                        `}>
                          {String.fromCharCode(65 + index)}
                        </div>
                        <span className="text-foreground font-medium flex-1 pt-1">
                          {answer}
                        </span>
                        {showFeedback && index === level.quiz.correctAnswer && (
                          <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                        )}
                        {showFeedback && index === selectedAnswer && index !== level.quiz.correctAnswer && (
                          <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <div className={`
                    p-6 rounded-xl border-2 
                    ${isCorrect 
                      ? 'bg-accent/10 border-accent' 
                      : 'bg-destructive/10 border-destructive'}
                  `}>
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
                      ) : (
                        <XCircle className="w-6 h-6 text-destructive flex-shrink-0 mt-1" />
                      )}
                      <div className="flex-1 space-y-2">
                        <p className={`font-bold text-lg ${isCorrect ? 'text-accent' : 'text-destructive'}`}>
                          {isCorrect ? 'Correct! 🎉' : 'Not quite, try again!'}
                        </p>
                        {isCorrect && (
                          <p className="text-foreground">
                            You just earned +10 EcoPoints! {level.quiz.explanation}
                          </p>
                        )}
                        {!isCorrect && (
                          <p className="text-foreground">
                            Take another look at the content above and try again.
                          </p>
                        )}
                      </div>
                    </div>
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
