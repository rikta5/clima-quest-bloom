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
  levelProgress: Record<string, string>; // levelId -> status
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
          setUserData(userDoc.data() as UserData);
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
