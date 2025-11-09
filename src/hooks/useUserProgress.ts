import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { Achievement } from '@/config/mockUser';

export interface UserData {
  name: string;
  email: string;
  phone?: string;
  ecoPoints: number;
  maxPoints: number;
  achievements: Achievement[];
  levelProgress: Record<string, string>; // levelId -> status (legacy)
  topicProgress?: Record<string, Record<number, number>>; // topicId -> levelNum -> completedLessons (0-5)
  topicCorrectAnswers?: Record<string, Record<number, number>>; // topicId -> levelNum -> correctAnswers (0-5)
  streak?: number;
  lastLoginDate?: string;
}

export const useUserProgress = () => {
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setUserData(null);
      setLoading(false);
      return;
    }

    const fetchUserData = async () => {
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const data = userDoc.data() as UserData;
          
          // Update streak on login
          const today = new Date().toISOString().split('T')[0];
          const lastLogin = data.lastLoginDate;
          
          let newStreak = data.streak || 0;
          
          if (!lastLogin) {
            newStreak = 1;
          } else {
            const lastLoginDate = new Date(lastLogin);
            const todayDate = new Date(today);
            const diffTime = todayDate.getTime() - lastLoginDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) {
              newStreak = (data.streak || 0) + 1;
            } else if (diffDays === 0) {
              newStreak = data.streak || 1;
            } else {
              newStreak = 1;
            }
          }
          
          // Update streak and last login date if needed
          if (lastLogin !== today) {
            await updateDoc(doc(db, 'users', user.uid), {
              streak: newStreak,
              lastLoginDate: today
            });
            data.streak = newStreak;
            data.lastLoginDate = today;
          }
          
          setUserData(data);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  const updateLevelProgress = async (levelId: number, status: string) => {
    if (!user) return;

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        [`levelProgress.${levelId}`]: status
      });

      // Update local state
      setUserData(prev => prev ? {
        ...prev,
        levelProgress: {
          ...prev.levelProgress,
          [levelId]: status
        }
      } : null);
    } catch (error) {
      console.error('Error updating level progress:', error);
    }
  };

  const addPoints = async (points: number) => {
    if (!user || !userData) return;

    try {
      const newPoints = userData.ecoPoints + points;
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        ecoPoints: newPoints
      });

      setUserData(prev => prev ? { ...prev, ecoPoints: newPoints } : null);
    } catch (error) {
      console.error('Error adding points:', error);
    }
  };

  const addAchievement = async (achievement: Achievement) => {
    if (!user || !userData) return;

    try {
      const newAchievements = [...userData.achievements, achievement];
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        achievements: newAchievements
      });

      setUserData(prev => prev ? { ...prev, achievements: newAchievements } : null);
    } catch (error) {
      console.error('Error adding achievement:', error);
    }
  };

  return {
    userData,
    loading,
    updateLevelProgress,
    addPoints,
    addAchievement
  };
};
