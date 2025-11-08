import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { geminiModel } from '../config/gemini';
import { collection, getDocs, query, limit } from 'firebase/firestore';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2 } from 'lucide-react';

interface ClimateData {
  topic?: string;
  fact?: string;
  details?: string;
}

interface Quiz {
  question: string;
  options: string[];
  correctIndex: number;
}

export default function ClimateLesson() {
  const [climateData, setClimateData] = useState<ClimateData | null>(null);
  const [paragraph, setParagraph] = useState('');
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    fetchClimateData();
  }, []);

  const fetchClimateData = async () => {
    try {
      const q = query(collection(db, 'climate_topics'), limit(1));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        const data = doc.data() as ClimateData;
        setClimateData(data);
        await generateContent(data);
      } else {
        console.error('No climate data found in Firestore');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const generateContent = async (data: ClimateData) => {
    try {
      // Generate paragraph
      const paragraphPrompt = `Write a 150-word educational paragraph for students about ${data.topic || 'climate change'}. Use this information: ${data.fact || ''}. ${data.details || ''}. Make it engaging, informative, and suitable for high school students.`;

      const paragraphResult = await geminiModel.generateContent(paragraphPrompt);
      const generatedParagraph = paragraphResult.response.text();
      setParagraph(generatedParagraph);

      // Generate quiz
      const quizPrompt = `Based on this paragraph: "${generatedParagraph}"
      
      Generate ONE multiple-choice question in this EXACT JSON format:
      {
        "question": "question text here",
        "options": ["option A", "option B", "option C", "option D"],
        "correctIndex": 0
      }
      
      Make sure the question tests understanding of the paragraph.
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
      console.error('Error generating content:', error);
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
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="ml-2 text-xl">Loading climate lesson...</span>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl text-primary">
            {climateData?.topic || 'Climate Change Topic'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">Learn About It:</h3>
            <p className="text-muted-foreground leading-relaxed">{paragraph}</p>
          </div>

          {quiz && (
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="text-xl font-semibold text-primary">Test Your Knowledge:</h3>
              <p className="text-lg font-medium">{quiz.question}</p>

              <div className="space-y-3">
                {quiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerClick(index)}
                    disabled={showResult}
                    className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                      showResult
                        ? index === quiz.correctIndex
                          ? 'bg-green-100 border-green-500 dark:bg-green-950'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-red-500 dark:bg-red-950'
                          : 'bg-muted border-border'
                        : 'bg-background border-border hover:border-primary hover:bg-accent'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className="space-y-4">
                  <p className={`text-lg font-semibold ${
                    selectedAnswer === quiz.correctIndex ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {selectedAnswer === quiz.correctIndex
                      ? '✓ Correct! Well done!'
                      : '✗ Incorrect. The correct answer is highlighted in green.'}
                  </p>
                  <Button onClick={handleNextLesson}>
                    Next Lesson →
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
