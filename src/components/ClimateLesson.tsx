import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2, ArrowLeft, Sparkles, Award, Building2 } from 'lucide-react';
import { MainLayout } from './MainLayout';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { toast } from 'sonner';
import { useTopicProgress } from '@/hooks/useTopicProgress';
import { useAchievements } from '@/hooks/useAchievements';
import { getCompanyByTopic } from '@/config/companies';
import confetti from 'canvas-confetti';

interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
}

interface EWasteData {
  Entity: string;
  Code?: string;
  Year: number;
  '12'?: {
    '5'?: number | string;
    [key: string]: any;
  };
  [key: string]: any;
}

interface TempChangeData {
  Area: string;
  Months?: string;
  Unit: string;
  [key: string]: any;
}

export default function ClimateLesson() {
  const { topicId, levelNum } = useParams<{ topicId: string; levelNum: string }>();
  const navigate = useNavigate();
  const { completeLessonInLevel, getLessonProgress, getCorrectAnswers, getMedalForLevel, LESSONS_PER_LEVEL, userData, loading: progressLoading } = useTopicProgress();
  const { checkLevelSpecificAchievements } = useAchievements();
  const [paragraph, setParagraph] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');
  const [showMedal, setShowMedal] = useState(false);
  const [earnedMedal, setEarnedMedal] = useState<'gold' | 'silver' | 'bronze' | null>(null);
  const [levelStartTime, setLevelStartTime] = useState<number>(Date.now());
  
  // Always derive current lesson from Firebase data - single source of truth
  const currentLesson = progressLoading || !userData || !topicId || !levelNum
    ? 1 
    : Math.min(getLessonProgress(topicId, parseInt(levelNum)) + 1, LESSONS_PER_LEVEL);

  // Reset state when navigating to different topic/level
  useEffect(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setParagraph('');
    setQuiz(null);
    setShowMedal(false);
    setEarnedMedal(null);
    setLoading(true);
    setLevelStartTime(Date.now()); // Reset timer for new level
  }, [topicId, levelNum]);

  // Fetch lesson data when ready and lesson changes
  useEffect(() => {
    if (!progressLoading && userData && topicId && levelNum && !showMedal) {
      fetchClimateData();
    }
  }, [currentLesson, progressLoading, userData, topicId, levelNum]);

  const getRandomYearField = (data: TempChangeData): { year: string; value: number } | null => {
    const yearFields = Object.keys(data).filter(key => key.startsWith('Y') && key.length === 5);
    if (yearFields.length === 0) return null;
    const randomField = yearFields[Math.floor(Math.random() * yearFields.length)];
    const value = data[randomField];
    if (typeof value === 'number') {
      return { year: randomField.substring(1), value };
    }
    return null;
  };

  const fetchClimateData = async () => {
    try {
      setLoading(true);
      
      if (topicId === 'e-waste') {
        setTopicTitle('E-Waste Recycling');
        const q = query(collection(db, 'electronic-waste-recycling-rate'), limit(10));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docs = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            console.log('E-Waste Raw Document:', JSON.stringify(data, null, 2));
            
            // Extract recycling rate from nested structure
            let recyclingRate = null;
            if (data['12'] && data['12']['5']) {
              const field5 = data['12']['5'];
              // The value is in a nested object with a long key
              const rateKey = Object.keys(field5).find(key => key.includes('EN_EWT_RCYR'));
              if (rateKey && field5[rateKey] !== undefined) {
                recyclingRate = typeof field5[rateKey] === 'string' ? parseFloat(field5[rateKey]) : field5[rateKey];
              }
            }
            
            console.log('Extracted Recycling Rate:', recyclingRate);
            return data.Entity && data.Year && recyclingRate !== null && !isNaN(recyclingRate);
          });
          
          if (docs.length > 0) {
            const randomDoc = docs[Math.floor(Math.random() * docs.length)];
            const data = randomDoc.data() as EWasteData;
            console.log('Selected E-Waste Document:', JSON.stringify(data, null, 2));
            await generateEWasteContent(data);
          } else {
            console.error('No valid e-waste data found after filtering');
            toast.error('No valid e-waste data found');
            setLoading(false);
          }
        } else {
          toast.error('No e-waste data available');
          setLoading(false);
        }
      } else if (topicId === 'temperature-change') {
        setTopicTitle('Temperature Change');
        const q = query(collection(db, 'temperature_change'), limit(10));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          const docs = querySnapshot.docs.filter(doc => {
            const data = doc.data();
            console.log('Temperature Change Raw Document:', JSON.stringify(data, null, 2));
            const yearData = getRandomYearField(data as TempChangeData);
            console.log('Extracted Year Data:', yearData);
            return data.Area && yearData !== null;
          });
          
          if (docs.length > 0) {
            const randomDoc = docs[Math.floor(Math.random() * docs.length)];
            const data = randomDoc.data() as TempChangeData;
            console.log('Selected Temperature Document:', JSON.stringify(data, null, 2));
            await generateTempChangeContent(data);
          } else {
            console.error('No valid temperature data found after filtering');
            toast.error('No valid temperature data found');
            setLoading(false);
          }
        } else {
          toast.error('No temperature data available');
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load lesson data');
      setLoading(false);
    }
  };

  const generateEWasteContent = async (data: EWasteData) => {
    try {
      // Extract recycling rate from nested structure
      let recyclingRate = 0;
      if (data['12'] && data['12']['5']) {
        const field5 = data['12']['5'];
        const rateKey = Object.keys(field5).find(key => key.includes('EN_EWT_RCYR'));
        if (rateKey && field5[rateKey] !== undefined) {
          recyclingRate = typeof field5[rateKey] === 'string' ? parseFloat(field5[rateKey]) : field5[rateKey];
        }
      }
      
      console.log('Generating content for:', {
        country: data.Entity,
        year: data.Year,
        recyclingRate: recyclingRate
      });

      // Different content formats based on lesson number for variety
      const contentFormats = [
        // Lesson 1: Scientific/Technical Focus
        `Write a 150-word educational paragraph explaining the SCIENCE behind e-waste recycling in ${data.Entity}.
Fact: In ${data.Year}, ${data.Entity} recycled ${recyclingRate}% of e-waste.
Focus on: What toxic materials are in electronics (lead, mercury, cadmium)? How does recycling recover valuable materials like gold, copper, and rare earth metals? What are the technical challenges? Use scientific terminology but explain clearly for students.`,
        
        // Lesson 2: Social Impact/Human Story
        `Write a 150-word compelling STORY about how e-waste recycling affects communities in ${data.Entity}.
Fact: In ${data.Year}, ${data.Entity} recycled ${recyclingRate}% of e-waste.
Tell a narrative: Imagine a family living near an e-waste facility. How does ${recyclingRate > 50 ? 'good' : 'poor'} recycling practices affect their health, jobs, and environment? Make it personal and relatable. Include emotional connection.`,
        
        // Lesson 3: Economic/Business Perspective
        `Write a 150-word analysis of the ECONOMIC aspects of e-waste recycling in ${data.Entity}.
Fact: In ${data.Year}, ${data.Entity} recycled ${recyclingRate}% of e-waste.
Explore: What is the market value of recovered materials? How many jobs does this create? What are the costs vs benefits? Why do businesses invest in recycling? Include specific examples of economic incentives.`,
        
        // Lesson 4: Comparative/Global Context
        `Write a 150-word COMPARISON analyzing ${data.Entity}'s e-waste recycling performance globally.
Fact: In ${data.Year}, ${data.Entity} recycled ${recyclingRate}% of e-waste.
Compare: How does this rate compare to world leaders? What makes some countries more successful? What can ${data.Entity} learn from best practices? Why do recycling rates vary so much between nations? Be analytical.`,
        
        // Lesson 5: Solution-Oriented/Future Focus
        `Write a 150-word forward-looking piece about SOLUTIONS to improve e-waste recycling beyond ${data.Entity}'s current ${recyclingRate}%.
Year context: ${data.Year}.
Focus on: What innovative technologies exist? What policy changes would help? How can individuals make a difference? What will e-waste management look like in 2030? Be optimistic but realistic about challenges and opportunities.`
      ];

      const paragraphPrompt = contentFormats[(currentLesson - 1) % contentFormats.length];

      const { data: paragraphData, error: paragraphError } = await supabase.functions.invoke('generate-climate-content', {
        body: { prompt: paragraphPrompt }
      });

      if (paragraphError) throw paragraphError;
      const generatedParagraph = paragraphData.text;
      setParagraph(generatedParagraph);

      // Different question types based on lesson number
      const questionTypes = [
        // Lesson 1: Factual/Scientific
        {
          question: `What percentage of electronic waste did ${data.Entity} recycle in ${data.Year}?`,
          options: [`${Math.max(0, recyclingRate - 20)}%`, `${Math.max(0, recyclingRate - 10)}%`, `${recyclingRate}%`, `${recyclingRate + 10}%`],
          correctIndex: 2
        },
        // Lesson 2: Impact/Analytical
        {
          question: `How does improper e-waste disposal affect communities and the environment?`,
          options: [
            "It has minimal environmental impact",
            "Toxic substances leak into soil, water, and air, harming health and ecosystems",
            "It only affects electronics manufacturers",
            "It makes technology more expensive"
          ],
          correctIndex: 1
        },
        // Lesson 3: Economic/Practical
        {
          question: `What economic benefits come from recycling e-waste?`,
          options: [
            "Only reduced waste disposal costs",
            "Recovery of valuable materials like gold and copper, plus job creation",
            "Higher taxes on electronics",
            "Decreased technology innovation"
          ],
          correctIndex: 1
        },
        // Lesson 4: Comparative/Critical Thinking
        {
          question: `Why do some countries have significantly higher e-waste recycling rates than others?`,
          options: [
            "They have more electronics",
            "Better regulations, infrastructure, public awareness, and economic incentives",
            "They produce less e-waste",
            "Their electronics are easier to recycle"
          ],
          correctIndex: 1
        },
        // Lesson 5: Solution/Application
        {
          question: `What is the MOST effective way to improve e-waste recycling rates?`,
          options: [
            "Only relying on voluntary individual actions",
            "Banning all electronics",
            "Combining policy regulations, accessible collection systems, and public education",
            "Waiting for technology to solve it automatically"
          ],
          correctIndex: 2
        }
      ];

      // Use lesson-specific question type instead of random
      const selectedQuestion = questionTypes[(currentLesson - 1) % questionTypes.length];
      const quizPrompt = `Based on this paragraph about e-waste in ${data.Entity}:
"${generatedParagraph}"

Generate ONE multiple-choice question in this EXACT JSON format (no other text):
${JSON.stringify(selectedQuestion)}

Adapt the question and options to fit the context of the paragraph while maintaining the question type and perspective.
Return ONLY valid JSON, nothing else.`;

      const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-climate-content', {
        body: { prompt: quizPrompt }
      });

      if (quizError) throw quizError;
      const quizText = quizData.text;

      const jsonMatch = quizText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]) as Quiz;
        setQuiz(quizData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error generating e-waste content:', error);
      toast.error('Failed to generate lesson content');
      setLoading(false);
    }
  };

  const generateTempChangeContent = async (data: TempChangeData) => {
    try {
      const yearData = getRandomYearField(data);
      if (!yearData) {
        toast.error('No temperature data available for this location');
        setLoading(false);
        return;
      }

      const { year, value } = yearData;
      const monthInfo = data.Months ? `, focusing on ${data.Months}` : '';
      const direction = value > 0 ? 'warming' : 'cooling';
      const magnitude = Math.abs(value) > 1 ? 'significant' : 'moderate';

      // Different content perspectives for each lesson
      const contentFormats = [
        // Lesson 1: Scientific Explanation
        `Write a 150-word SCIENTIFIC explanation of temperature anomalies in ${data.Area}${monthInfo}.
Fact: In ${year}, the temperature anomaly was ${value}${data.Unit} vs 1961 baseline.
Explain: What is a temperature anomaly? How do scientists measure it? What causes ${direction}? What role do greenhouse gases, ocean currents, and atmospheric patterns play? Use precise scientific language but make it accessible to students.`,
        
        // Lesson 2: Real-World Impact Story
        `Write a 150-word narrative about how a ${magnitude} ${direction} of ${Math.abs(value)}${data.Unit} affects DAILY LIFE in ${data.Area}${monthInfo}.
Year: ${year}.
Tell a story: How does this impact agriculture, water resources, health, or energy use? Include specific examples of people, crops, or ecosystems affected. Make readers feel the human dimension of climate data.`,
        
        // Lesson 3: Economic & Infrastructure Impact
        `Write a 150-word analysis of the ECONOMIC consequences of ${data.Area}'s ${value}${data.Unit} temperature anomaly in ${year}${monthInfo}.
Examine: Costs to agriculture, infrastructure damage, energy demands, insurance impacts, and adaptation expenses. What industries are most vulnerable? What are the long-term economic risks? Be specific with examples.`,
        
        // Lesson 4: Comparative & Trend Analysis
        `Write a 150-word COMPARATIVE analysis placing ${data.Area}'s ${year} temperature anomaly (${value}${data.Unit}) in GLOBAL CONTEXT${monthInfo}.
Compare: How does this trend compare to global averages? Why do some regions warm faster? Is ${data.Area} above or below global trends? What does this tell us about regional climate vulnerability? Analyze patterns critically.`,
        
        // Lesson 5: Solutions & Adaptation
        `Write a 150-word forward-thinking piece about SOLUTIONS to address ${data.Area}'s climate challenges given its ${value}${data.Unit} temperature shift (${year})${monthInfo}.
Focus: What mitigation strategies exist? How can communities adapt? What technologies or policies show promise? What can individuals do? Balance realism about challenges with hope about solutions.`
      ];

      const paragraphPrompt = contentFormats[(currentLesson - 1) % contentFormats.length];

      const { data: paragraphData, error: paragraphError } = await supabase.functions.invoke('generate-climate-content', {
        body: { prompt: paragraphPrompt }
      });

      if (paragraphError) throw paragraphError;
      const generatedParagraph = paragraphData.text;
      setParagraph(generatedParagraph);

      // Diverse question types matching lesson perspectives
      const questionTypes = [
        // Lesson 1: Scientific/Technical
        {
          question: `What was ${data.Area}'s temperature anomaly in ${year} compared to the 1961 baseline?`,
          options: [
            `${(value - 1).toFixed(2)}${data.Unit}`,
            `${(value - 0.4).toFixed(2)}${data.Unit}`,
            `${value.toFixed(2)}${data.Unit}`,
            `${(value + 1).toFixed(2)}${data.Unit}`
          ],
          correctIndex: 2
        },
        // Lesson 2: Impact/Application
        {
          question: `How does a temperature anomaly of ${value}${data.Unit} impact communities and ecosystems in ${data.Area}?`,
          options: [
            "Temperature changes have no real-world effects",
            "Affects agriculture, water availability, health, and biodiversity patterns",
            "Only impacts tourism",
            "Only affects winter sports"
          ],
          correctIndex: 1
        },
        // Lesson 3: Economic/Practical
        {
          question: `What are the main economic costs associated with regional temperature anomalies?`,
          options: [
            "There are no economic impacts",
            "Only higher air conditioning bills",
            "Agricultural losses, infrastructure damage, health costs, and adaptation expenses",
            "Only affects insurance companies"
          ],
          correctIndex: 2
        },
        // Lesson 4: Analytical/Comparative
        {
          question: `Why do some regions experience larger temperature anomalies than the global average?`,
          options: [
            "All regions warm equally over time",
            "Local geography, ocean currents, altitude, and feedback loops create regional variations",
            "It's random variation with no pattern",
            "Only due to measurement errors"
          ],
          correctIndex: 1
        },
        // Lesson 5: Solutions/Future-Oriented
        {
          question: `What is the MOST comprehensive approach to addressing regional temperature increases?`,
          options: [
            "Ignore it and hope it reverses naturally",
            "Only focus on individual lifestyle changes",
            "Combine emission reduction, adaptation infrastructure, policy changes, and community resilience",
            "Wait for a technological breakthrough"
          ],
          correctIndex: 2
        }
      ];

      // Use lesson-specific question type instead of random
      const selectedQuestion = questionTypes[(currentLesson - 1) % questionTypes.length];
      const quizPrompt = `Based on this paragraph about temperature change in ${data.Area}:
"${generatedParagraph}"

Generate ONE multiple-choice question in this EXACT JSON format (no other text):
${JSON.stringify(selectedQuestion)}

Adapt the question and options to fit the context of the paragraph while maintaining the question type and perspective.
Return ONLY valid JSON, nothing else.`;

      const { data: quizData, error: quizError } = await supabase.functions.invoke('generate-climate-content', {
        body: { prompt: quizPrompt }
      });

      if (quizError) throw quizError;
      const quizText = quizData.text;

      const jsonMatch = quizText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]) as Quiz;
        setQuiz(quizData);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error generating temperature content:', error);
      toast.error('Failed to generate lesson content');
      setLoading(false);
    }
  };

  const handleAnswerClick = (index: number) => {
    setSelectedAnswer(index);
    setShowResult(true);
  };

  const handleNextLesson = async () => {
    if (!topicId || !levelNum) return;

    // Complete the lesson (correct/incorrect based on answer)
    const isCorrect = selectedAnswer === quiz?.correctIndex;
    const result = await completeLessonInLevel(topicId, parseInt(levelNum), isCorrect);
    
    if (result !== null) {
      const { lessons: newLessonCount, correct: correctCount } = result;
      
      if (newLessonCount >= LESSONS_PER_LEVEL) {
        // Level completed! Calculate completion time
        const completionTimeSeconds = Math.floor((Date.now() - levelStartTime) / 1000);
        
        // Check for achievements
        await checkLevelSpecificAchievements(
          topicId,
          parseInt(levelNum),
          correctCount,
          completionTimeSeconds
        );
        
        // Show medal
        const medal = getMedalForLevel(correctCount);
        setEarnedMedal(medal);
        setShowMedal(true);
        
        const medalText = medal ? `${medal.charAt(0).toUpperCase() + medal.slice(1)} Medal! 🏆` : 'Completed!';
        const pointsText = isCorrect ? '+2 Eco Points' : '+1 Eco Point';
        toast.success(`Level completed! ${correctCount}/5 correct - ${medalText} ${pointsText}`);
        
        // Check if this is the last level of e-waste (level 10) - trigger unlock celebration
        if (topicId === 'e-waste' && parseInt(levelNum) === 10) {
          // Trigger confetti celebration
          const duration = 3000;
          const animationEnd = Date.now() + duration;
          const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

          function randomInRange(min: number, max: number) {
            return Math.random() * (max - min) + min;
          }

          const interval: any = setInterval(function() {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
              return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
            });
            confetti({
              ...defaults,
              particleCount,
              origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
            });
          }, 250);

          // Show special unlock toast
          setTimeout(() => {
            toast.success('🎉 Temperature Change Topic Unlocked!', {
              description: 'You completed E-Waste Recycling! New learning awaits.',
              duration: 5000,
            });
          }, 1000);
        }
        
        // Navigate back after showing medal
        setTimeout(() => navigate(`/topic/${topicId}`), 3000);
        return;
      } else {
        // Show progress
        const pointsText = isCorrect ? '+2 Eco Points' : '+1 Eco Point';
        toast.success(`Lesson ${newLessonCount}/${LESSONS_PER_LEVEL} completed! ${pointsText}`);
      }
    }

    // Reset quiz state - useEffect will handle fetching new data based on updated Firebase data
    setSelectedAnswer(null);
    setShowResult(false);
  };

  if (loading || progressLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xl text-muted-foreground">
            Loading lesson...
          </span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {showMedal ? (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4 flex items-center justify-center">
          <Card className="max-w-2xl w-full p-12 text-center space-y-8 border-2 shadow-2xl">
            <div className="space-y-4">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Level {levelNum} Complete!
              </h2>
              
              {earnedMedal && (
                <div className="flex flex-col items-center gap-4 py-8">
                  <div className={`text-8xl animate-bounce ${
                    earnedMedal === 'gold' ? '🥇' :
                    earnedMedal === 'silver' ? '🥈' : '🥉'
                  }`}>
                    {earnedMedal === 'gold' ? '🥇' :
                     earnedMedal === 'silver' ? '🥈' : '🥉'}
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {earnedMedal.charAt(0).toUpperCase() + earnedMedal.slice(1)} Medal Earned!
                  </p>
                </div>
              )}
              
              {!earnedMedal && (
                <div className="py-8">
                  <p className="text-xl text-muted-foreground">
                    Level completed! Keep practicing to earn medals.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Get 3+ correct answers to earn bronze, 4+ for silver, 5/5 for gold!
                  </p>
                </div>
              )}
              
              <p className="text-muted-foreground">Returning to level selection...</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button
            variant="ghost"
            onClick={() => navigate(`/topic/${topicId}`)}
            className="gap-2 hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Levels
          </Button>

          <Card className="overflow-hidden border-2 shadow-xl">
            <div className={`h-2 bg-gradient-to-r ${
              topicId === 'e-waste' 
                ? 'from-green-500 to-emerald-600' 
                : 'from-orange-500 to-red-600'
            }`} />
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
                  <Sparkles className="w-8 h-8 text-primary" />
                  {topicTitle}
                </CardTitle>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Level {levelNum}</p>
                  <p className="text-lg font-bold text-primary">Lesson {currentLesson}/5</p>
                </div>
              </div>
              {topicId && getCompanyByTopic(topicId) && (
                <Link to={`/company/${getCompanyByTopic(topicId)?.id}`}>
                  <Badge 
                    variant="outline" 
                    className="bg-accent/10 hover:bg-accent/20 text-accent border-accent/30 transition-colors cursor-pointer"
                  >
                    <Building2 className="w-3 h-3 mr-1" />
                    Data by: {getCompanyByTopic(topicId)?.shortName}
                  </Badge>
                </Link>
              )}
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                  style={{ width: `${((currentLesson - 1) / LESSONS_PER_LEVEL) * 100}%` }}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
                  <h3 className="text-xl font-semibold">Learn About It</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-lg">{paragraph}</p>
              </div>

              {quiz && (
                <div className="bg-gradient-to-br from-muted/50 to-muted/30 rounded-xl p-6 space-y-6 border">
                  <div className="flex items-center gap-2">
                    <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/40 rounded-full" />
                    <h3 className="text-xl font-semibold text-primary">Test Your Knowledge</h3>
                  </div>
                  <p className="text-lg font-medium">{quiz.question}</p>

                  <div className="space-y-3">
                    {quiz.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerClick(index)}
                        disabled={showResult}
                        className={`w-full p-4 text-left rounded-lg border-2 transition-all font-medium ${
                          showResult
                            ? index === quiz.correctIndex
                              ? 'bg-green-100 border-green-500 dark:bg-green-950 dark:border-green-600 shadow-lg'
                              : index === selectedAnswer
                              ? 'bg-red-100 border-red-500 dark:bg-red-950 dark:border-red-600'
                              : 'bg-muted/50 border-border opacity-50'
                            : 'bg-background border-border hover:border-primary hover:bg-accent hover:scale-[1.02] active:scale-[0.98]'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>

                  {showResult && (
                    <div className="space-y-4 pt-4 border-t">
                      <p className={`text-lg font-semibold flex items-center gap-2 ${
                        selectedAnswer === quiz.correctIndex ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {selectedAnswer === quiz.correctIndex
                          ? '✓ Correct! Well done!'
                          : '✗ Incorrect. The correct answer is highlighted in green.'}
                      </p>
                      <Button 
                        onClick={handleNextLesson}
                        className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 transition-all"
                      >
                        Next Lesson
                        <Sparkles className="w-4 h-4" />
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      )}
    </MainLayout>
  );
}
