import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { geminiModel } from '../config/gemini';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, ArrowLeft, Sparkles } from 'lucide-react';
import { MainLayout } from './MainLayout';
import { db } from '../lib/firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { toast } from 'sonner';

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
  const [paragraph, setParagraph] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [topicTitle, setTopicTitle] = useState('');

  useEffect(() => {
    fetchClimateData();
  }, [topicId, levelNum]);

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

      const paragraphPrompt = `Write a 150-word educational paragraph for high school students about e-waste recycling in ${data.Entity} in ${data.Year}.
Use this fact: 'In ${data.Year}, ${data.Entity} recycled ${recyclingRate}% of its electronic waste.'
Explain why ${recyclingRate > 50 ? 'such a high' : 'this'} recycling rate matters, what benefits it brings to the environment and economy, and what lessons other countries could learn from ${data.Entity}'s example.
Make it engaging, informative, and easy to understand.`;

      const paragraphResult = await geminiModel.generateContent(paragraphPrompt);
      const generatedParagraph = paragraphResult.response.text();
      setParagraph(generatedParagraph);

      const questionTypes = [
        {
          question: `What percentage of electronic waste did ${data.Entity} recycle in ${data.Year}?`,
          options: [`${Math.max(0, recyclingRate - 20)}%`, `${Math.max(0, recyclingRate - 10)}%`, `${recyclingRate}%`, `${recyclingRate + 10}%`],
          correctIndex: 2
        },
        {
          question: `Why is e-waste recycling important for the environment?`,
          options: [
            "It only saves money",
            "It prevents toxic materials from polluting soil and water",
            "It makes electronics cheaper",
            "It reduces electricity usage"
          ],
          correctIndex: 1
        },
        {
          question: `What happens when e-waste is not properly recycled?`,
          options: [
            "Nothing significant occurs",
            "It creates more jobs",
            "Toxic substances can leak into the environment",
            "Electronics become more valuable"
          ],
          correctIndex: 2
        },
        {
          question: `Countries with high e-waste recycling rates generally see:`,
          options: [
            "Decreased environmental protection",
            "Better resource recovery and less pollution",
            "Higher electronics prices",
            "Reduced technology innovation"
          ],
          correctIndex: 1
        }
      ];

      const randomQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const quizPrompt = `Based on this paragraph about e-waste in ${data.Entity}:
"${generatedParagraph}"

Generate ONE multiple-choice question in this EXACT JSON format (no other text):
${JSON.stringify(randomQuestion)}

Adapt the question and options to fit the context of the paragraph while maintaining the question type.
Return ONLY valid JSON, nothing else.`;

      const quizResult = await geminiModel.generateContent(quizPrompt);
      const quizText = quizResult.response.text();

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

      const paragraphPrompt = `Write a 150-word educational paragraph for high school students about climate-driven temperature change in ${data.Area}${monthInfo}.
Use this fact: 'In ${year}, ${data.Area}'s temperature anomaly was ${value}${data.Unit} compared to the 1961 baseline.'
Explain what a temperature anomaly means, why ${data.Months || ''} temperatures are changing, what impacts this has on ${data.Area}'s climate and people, and why this matters for global climate change awareness.
Make it engaging, informative, and easy to understand.`;

      const paragraphResult = await geminiModel.generateContent(paragraphPrompt);
      const generatedParagraph = paragraphResult.response.text();
      setParagraph(generatedParagraph);

      const questionTypes = [
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
        {
          question: `What does a temperature anomaly indicate?`,
          options: [
            "The current temperature",
            "How much temperature differs from a baseline average",
            "The hottest day of the year",
            "The humidity level"
          ],
          correctIndex: 1
        },
        {
          question: `Rising temperature anomalies primarily result from:`,
          options: [
            "Natural weather variations only",
            "Seasonal changes",
            "Human activities increasing greenhouse gases",
            "Ocean currents alone"
          ],
          correctIndex: 2
        },
        {
          question: `Why do scientists track temperature anomalies over time?`,
          options: [
            "To predict daily weather",
            "To identify long-term climate change patterns",
            "To set thermostat levels",
            "To measure rainfall"
          ],
          correctIndex: 1
        }
      ];

      const randomQuestion = questionTypes[Math.floor(Math.random() * questionTypes.length)];
      const quizPrompt = `Based on this paragraph about temperature change in ${data.Area}:
"${generatedParagraph}"

Generate ONE multiple-choice question in this EXACT JSON format (no other text):
${JSON.stringify(randomQuestion)}

Adapt the question and options to fit the context of the paragraph while maintaining the question type.
Return ONLY valid JSON, nothing else.`;

      const quizResult = await geminiModel.generateContent(quizPrompt);
      const quizText = quizResult.response.text();

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

  const handleNextLesson = () => {
    setLoading(true);
    setSelectedAnswer(null);
    setShowResult(false);
    setParagraph('');
    setQuiz(null);
    fetchClimateData();
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[70vh] gap-4">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <span className="text-xl text-muted-foreground">Generating AI-powered lesson...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
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
              <CardTitle className="text-3xl bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent flex items-center gap-3">
                <Sparkles className="w-8 h-8 text-primary" />
                {topicTitle}
              </CardTitle>
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
    </MainLayout>
  );
}
