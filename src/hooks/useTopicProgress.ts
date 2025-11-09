import { useUserProgress } from './useUserProgress';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

const LESSONS_PER_LEVEL = 5;

export const useTopicProgress = () => {
  const { user } = useAuth();
  const { userData, loading } = useUserProgress();

  const getLessonProgress = (topicId: string, levelNum: number): number => {
    return userData?.topicProgress?.[topicId]?.[levelNum] || 0;
  };

  const getCorrectAnswers = (topicId: string, levelNum: number): number => {
    if (!userData?.topicCorrectAnswers?.[topicId]?.[levelNum]) {
      return 0;
    }
    return userData.topicCorrectAnswers[topicId][levelNum] || 0;
  };

  const getMedalForLevel = (correctAnswers: number): 'gold' | 'silver' | 'bronze' | null => {
    if (correctAnswers === 5) return 'gold';
    if (correctAnswers === 4) return 'silver';
    if (correctAnswers === 3) return 'bronze';
    return null;
  };

  const getTopicLevelStatus = (topicId: string, levelNum: number): 'locked' | 'unlocked' | 'completed' => {
    if (!userData?.topicProgress) {
      return levelNum === 1 ? "unlocked" : "locked";
    }
    
    const topicData = userData.topicProgress[topicId];
    if (!topicData) {
      return levelNum === 1 ? "unlocked" : "locked";
    }
    
    const lessonsCompleted = topicData[levelNum] || 0;
    
    // If all 5 lessons completed, level is completed
    if (lessonsCompleted >= LESSONS_PER_LEVEL) {
      return "completed";
    }
    
    // If some lessons completed or previous level is completed, level is unlocked
    if (lessonsCompleted > 0) {
      return "unlocked";
    }
    
    // Check if previous level is completed to unlock this one
    if (levelNum === 1) {
      return "unlocked";
    }
    
    const prevLevelLessons = topicData[levelNum - 1] || 0;
    return prevLevelLessons >= LESSONS_PER_LEVEL ? "unlocked" : "locked";
  };

  const completeLessonInLevel = async (topicId: string, levelNum: number, isCorrect: boolean) => {
    if (!user || !userData) {
      console.log('No user or userData');
      return null;
    }

    try {
      const currentLessons = getLessonProgress(topicId, levelNum);
      const currentCorrect = getCorrectAnswers(topicId, levelNum);
      
      const newLessons = Math.min(currentLessons + 1, LESSONS_PER_LEVEL);
      const newCorrect = isCorrect ? Math.min(currentCorrect + 1, LESSONS_PER_LEVEL) : currentCorrect;
      
      // Award 2 points for correct, 1 point for incorrect (still learning!)
      const pointsEarned = isCorrect ? 2 : 1;
      
      console.log(`Completing lesson: current=${currentLessons}, new=${newLessons}, correct=${newCorrect}`);
      
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        [`topicProgress.${topicId}.${levelNum}`]: newLessons,
        [`topicCorrectAnswers.${topicId}.${levelNum}`]: newCorrect,
        ecoPoints: userData.ecoPoints + pointsEarned
      });

      console.log('Firebase updated successfully');

      // If this completes the level, unlock next level
      if (newLessons >= LESSONS_PER_LEVEL) {
        const nextLevelNum = levelNum + 1;
        if (nextLevelNum <= 10) {
          const nextLevelLessons = userData.topicProgress?.[topicId]?.[nextLevelNum];
          if (nextLevelLessons === undefined || nextLevelLessons === 0) {
            await updateDoc(userRef, {
              [`topicProgress.${topicId}.${nextLevelNum}`]: 0
            });
          }
        }
      }

      // Force a small delay to ensure Firestore write completes
      await new Promise(resolve => setTimeout(resolve, 200));

      return { lessons: newLessons, correct: newCorrect };
    } catch (error) {
      console.error('Error completing lesson:', error);
      return null;
    }
  };

  const getTopicCompletionStats = (topicId: string) => {
    if (!userData?.topicProgress?.[topicId]) {
      return { completed: 0, total: 50, percentage: 0, levels: 0 };
    }

    const topicData = userData.topicProgress[topicId];
    let totalLessons = 0;
    let completedLevels = 0;

    Object.keys(topicData).forEach(levelKey => {
      const lessons = topicData[parseInt(levelKey)] || 0;
      totalLessons += lessons;
      if (lessons >= LESSONS_PER_LEVEL) {
        completedLevels++;
      }
    });

    const percentage = (totalLessons / 50) * 100; // 10 levels * 5 lessons = 50 total

    return { 
      completed: totalLessons, 
      total: 50, 
      percentage,
      levels: completedLevels
    };
  };

  return {
    userData,
    loading,
    getTopicLevelStatus,
    getLessonProgress,
    getCorrectAnswers,
    getMedalForLevel,
    completeLessonInLevel,
    getTopicCompletionStats,
    LESSONS_PER_LEVEL
  };
};
