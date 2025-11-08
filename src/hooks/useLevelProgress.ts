import { useUserProgress } from './useUserProgress';
import { LevelStatus } from '@/config/levelsConfig';

export const useLevelProgress = () => {
  const { userData, updateLevelProgress, addPoints } = useUserProgress();

  const getLevelStatus = (levelId: number): LevelStatus => {
    if (!userData?.levelProgress) {
      // Default: first level unlocked, rest locked
      return levelId === 1 ? "unlocked" : "locked";
    }
    const status = userData.levelProgress[levelId];
    return (status as LevelStatus) || "locked";
  };

  const completeLevel = async (levelId: number, pointsEarned: number = 10) => {
    await updateLevelProgress(levelId, "completed");
    await addPoints(pointsEarned);
    
    // Unlock next level
    const nextLevelId = levelId + 1;
    const nextLevelStatus = getLevelStatus(nextLevelId);
    if (nextLevelStatus === "locked") {
      await updateLevelProgress(nextLevelId, "unlocked");
    }
  };

  return {
    userData,
    getLevelStatus,
    completeLevel,
    updateLevelProgress,
    addPoints
  };
};
