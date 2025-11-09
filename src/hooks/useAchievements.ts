import { useUserProgress } from './useUserProgress';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { ACHIEVEMENT_DEFINITIONS, getAchievementById } from '@/config/achievements';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';

export const useAchievements = () => {
  const { user } = useAuth();
  const { userData, refetchUserData } = useUserProgress();

  const triggerAchievementConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22c55e', '#3b82f6', '#a855f7', '#f59e0b']
    });
  };

  const checkAndAwardAchievement = async (achievementId: string): Promise<boolean> => {
    if (!user || !userData) return false;

    // Check if already earned
    const alreadyEarned = userData.achievements?.some(a => a.id === achievementId);
    if (alreadyEarned) return false;

    const achievement = getAchievementById(achievementId);
    if (!achievement) return false;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        achievements: arrayUnion({
          ...achievement,
          earned: true,
          earnedAt: new Date().toISOString()
        })
      });

      // Show toast and confetti
      triggerAchievementConfetti();
      toast.success(`🎉 Achievement Unlocked: ${achievement.name}!`, {
        description: achievement.description,
        duration: 5000,
      });

      // Refetch user data to sync achievements
      await refetchUserData();

      return true;
    } catch (error) {
      console.error('Error awarding achievement:', error);
      return false;
    }
  };

  const checkAchievements = async () => {
    if (!userData) return;

    const checks: Array<{ condition: boolean; id: string }> = [];

    // Calculate totals
    let totalLessons = 0;
    let totalLevels = 0;
    let goldMedals = 0;

    if (userData.topicProgress) {
      Object.keys(userData.topicProgress).forEach(topicId => {
        const topicData = userData.topicProgress![topicId];
        Object.keys(topicData).forEach(levelKey => {
          const lessons = topicData[parseInt(levelKey)] || 0;
          totalLessons += lessons;
          if (lessons >= 5) totalLevels++;
        });
      });
    }

    if (userData.topicCorrectAnswers) {
      Object.keys(userData.topicCorrectAnswers).forEach(topicId => {
        const topicData = userData.topicCorrectAnswers![topicId];
        Object.values(topicData).forEach(correct => {
          if (correct === 5) goldMedals++;
        });
      });
    }

    const completedTopics = userData.topicProgress 
      ? Object.keys(userData.topicProgress).filter(topicId => {
          const topicData = userData.topicProgress![topicId];
          const completedLevels = Object.values(topicData).filter(l => l >= 5).length;
          return completedLevels === 10;
        }).length
      : 0;

    // First time achievements
    checks.push({ condition: totalLessons >= 1, id: 'first-lesson' });
    checks.push({ condition: totalLevels >= 1, id: 'first-level' });
    checks.push({ condition: completedTopics >= 1, id: 'first-topic' });

    // Lesson milestones
    checks.push({ condition: totalLessons >= 5, id: 'lessons-5' });
    checks.push({ condition: totalLessons >= 10, id: 'lessons-10' });
    checks.push({ condition: totalLessons >= 25, id: 'lessons-25' });
    checks.push({ condition: totalLessons >= 50, id: 'lessons-50' });
    checks.push({ condition: totalLessons >= 100, id: 'lessons-100' });

    // Level milestones
    checks.push({ condition: totalLevels >= 5, id: 'levels-5' });
    checks.push({ condition: totalLevels >= 10, id: 'levels-10' });
    checks.push({ condition: totalLevels >= 20, id: 'levels-20' });

    // Perfect performance
    checks.push({ condition: goldMedals >= 1, id: 'perfect-level' });
    checks.push({ condition: goldMedals >= 3, id: 'three-gold' });

    // Streak achievements
    const streak = userData.streak || 0;
    checks.push({ condition: streak >= 3, id: 'streak-3' });
    checks.push({ condition: streak >= 7, id: 'streak-7' });
    checks.push({ condition: streak >= 30, id: 'streak-30' });

    // Points achievements
    checks.push({ condition: userData.ecoPoints >= 50, id: 'points-50' });
    checks.push({ condition: userData.ecoPoints >= 100, id: 'points-100' });
    checks.push({ condition: userData.ecoPoints >= 250, id: 'points-250' });

    // Ultimate achievements
    checks.push({ condition: completedTopics >= 2, id: 'all-topics' }); // When all topics are done
    
    const totalEarnedAchievements = userData.achievements?.length || 0;
    const totalPossibleAchievements = ACHIEVEMENT_DEFINITIONS.length;
    checks.push({ 
      condition: totalEarnedAchievements === totalPossibleAchievements - 1, // -1 for eco-champion itself
      id: 'eco-champion' 
    });

    // Check each achievement
    for (const check of checks) {
      if (check.condition) {
        await checkAndAwardAchievement(check.id);
      }
    }
  };

  const checkLevelSpecificAchievements = async (
    topicId: string,
    levelNum: number,
    correctAnswers: number,
    completionTimeSeconds?: number
  ) => {
    // Perfect level
    if (correctAnswers === 5) {
      await checkAndAwardAchievement('perfect-level');
    }

    // Speed demon (under 5 minutes)
    if (completionTimeSeconds && completionTimeSeconds < 300) {
      await checkAndAwardAchievement('speed-demon');
    }

    // Run full achievement check
    await checkAchievements();
  };

  return {
    checkAchievements,
    checkLevelSpecificAchievements,
    checkAndAwardAchievement
  };
};
