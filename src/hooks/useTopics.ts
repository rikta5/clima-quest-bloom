import { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLevelProgress } from './useLevelProgress';

export interface FirestoreTopic {
  id: string;
  name: string;
  description: string;
  complexity: "Beginner" | "Intermediate" | "Advanced";
  image: string;
  order: number;
  levels: {
    id: number;
    title: string;
    type: "core" | "bonus";
    description?: string;
    content?: string;
    quiz?: {
      question: string;
      answers: string[];
      correctAnswer: number;
      explanation?: string;
    };
  }[];
}

export const useTopics = () => {
  const [topics, setTopics] = useState<FirestoreTopic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { getLevelStatus } = useLevelProgress();

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsQuery = query(
          collection(db, 'topics'),
          orderBy('order', 'asc')
        );
        
        const querySnapshot = await getDocs(topicsQuery);
        const fetchedTopics: FirestoreTopic[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedTopics.push({
            id: doc.id,
            name: data.name || '',
            description: data.description || '',
            complexity: data.complexity || 'Beginner',
            image: data.image || '',
            order: data.order || 0,
            levels: data.levels || []
          });
        });

        // Add dynamic status to levels based on user progress
        const topicsWithStatus = fetchedTopics.map(topic => ({
          ...topic,
          levels: topic.levels.map(level => ({
            ...level,
            status: getLevelStatus(level.id)
          }))
        }));

        setTopics(topicsWithStatus);
        setError(null);
      } catch (err) {
        console.error('Error fetching topics:', err);
        setError('Failed to load topics');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [getLevelStatus]);

  return { topics, loading, error };
};
