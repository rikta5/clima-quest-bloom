import { useUserProgress } from './useUserProgress';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';

export const useTopicProgress = () => {
  const { user } = useAuth();
  const { userData, loading } = useUserProgress();

  const getTopicLevelStatus = (topicId: string, levelNum: number): 'locked' | 'unlocked' | 'completed' => {
    if (!userData?.topicProgress) {
      // Default: first level of each topic unlocked, rest locked
      return levelNum === 1 ? "unlocked" : "locked";
    }
    
    const topicData = userData.topicProgress[topicId];
    if (!topicData) {
      return levelNum === 1 ? "unlocked" : "locked";
    }
    
    const status = topicData[levelNum];
    return (status as 'locked' | 'unlocked' | 'completed') || "locked";
  };

  const completeTopicLevel = async (topicId: string, levelNum: number, pointsEarned: number = 10) => {
    if (!user || !userData) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Update the completed level
      await updateDoc(userRef, {
        [`topicProgress.${topicId}.${levelNum}`]: "completed",
        ecoPoints: userData.ecoPoints + pointsEarned
      });

      // Unlock next level if not already unlocked
      const nextLevelNum = levelNum + 1;
      if (nextLevelNum <= 10) { // Max 10 levels per topic
        const nextLevelStatus = getTopicLevelStatus(topicId, nextLevelNum);
        if (nextLevelStatus === "locked") {
          await updateDoc(userRef, {
            [`topicProgress.${topicId}.${nextLevelNum}`]: "unlocked"
          });
        }
      }
    } catch (error) {
      console.error('Error completing topic level:', error);
    }
  };

  const getTopicCompletionStats = (topicId: string) => {
    if (!userData?.topicProgress?.[topicId]) {
      return { completed: 0, total: 10, percentage: 0 };
    }

    const topicData = userData.topicProgress[topicId];
    const completed = Object.values(topicData).filter(status => status === 'completed').length;
    const total = 10; // Each topic has 10 levels
    const percentage = (completed / total) * 100;

    return { completed, total, percentage };
  };

  return {
    userData,
    loading,
    getTopicLevelStatus,
    completeTopicLevel,
    getTopicCompletionStats
  };
};
