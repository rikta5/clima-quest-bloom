export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  earned: boolean;
  earnedAt?: string;
}

export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'earned'>[] = [
  // First time achievements
  {
    id: 'first-lesson',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: '🌱',
    color: 'bg-green-600'
  },
  {
    id: 'first-level',
    name: 'Level Up',
    description: 'Complete your first level',
    icon: '⬆️',
    color: 'bg-blue-600'
  },
  {
    id: 'first-topic',
    name: 'Topic Master',
    description: 'Complete your first topic',
    icon: '🎓',
    color: 'bg-purple-600'
  },
  
  // Lesson milestones
  {
    id: 'lessons-5',
    name: 'Getting Started',
    description: 'Complete 5 lessons',
    icon: '📚',
    color: 'bg-cyan-600'
  },
  {
    id: 'lessons-10',
    name: 'Knowledge Seeker',
    description: 'Complete 10 lessons',
    icon: '📖',
    color: 'bg-teal-600'
  },
  {
    id: 'lessons-25',
    name: 'Dedicated Learner',
    description: 'Complete 25 lessons',
    icon: '🎯',
    color: 'bg-indigo-600'
  },
  {
    id: 'lessons-50',
    name: 'Half Century',
    description: 'Complete 50 lessons',
    icon: '💯',
    color: 'bg-orange-600'
  },
  {
    id: 'lessons-100',
    name: 'Century Club',
    description: 'Complete 100 lessons',
    icon: '🏆',
    color: 'bg-yellow-600'
  },
  
  // Level milestones
  {
    id: 'levels-5',
    name: 'Rising Star',
    description: 'Complete 5 levels',
    icon: '⭐',
    color: 'bg-pink-600'
  },
  {
    id: 'levels-10',
    name: 'Topic Champion',
    description: 'Complete 10 levels',
    icon: '🌟',
    color: 'bg-violet-600'
  },
  {
    id: 'levels-20',
    name: 'Climate Expert',
    description: 'Complete 20 levels',
    icon: '💫',
    color: 'bg-fuchsia-600'
  },
  
  // Perfect performance
  {
    id: 'perfect-level',
    name: 'Perfect Score',
    description: 'Get all 5 questions correct in a level',
    icon: '🥇',
    color: 'bg-amber-600'
  },
  {
    id: 'speed-demon',
    name: 'Speed Demon',
    description: 'Complete a level in under 5 minutes',
    icon: '⚡',
    color: 'bg-red-600'
  },
  {
    id: 'three-gold',
    name: 'Gold Rush',
    description: 'Earn 3 gold medals',
    icon: '🥇🥇🥇',
    color: 'bg-yellow-500'
  },
  
  // Streak achievements
  {
    id: 'streak-3',
    name: 'Hot Streak',
    description: 'Login for 3 days in a row',
    icon: '🔥',
    color: 'bg-orange-500'
  },
  {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Login for 7 days in a row',
    icon: '🔥🔥',
    color: 'bg-red-500'
  },
  {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Login for 30 days in a row',
    icon: '🔥🔥🔥',
    color: 'bg-rose-600'
  },
  
  // Points achievements
  {
    id: 'points-50',
    name: 'Point Collector',
    description: 'Earn 50 eco points',
    icon: '💰',
    color: 'bg-emerald-600'
  },
  {
    id: 'points-100',
    name: 'Point Master',
    description: 'Earn 100 eco points',
    icon: '💎',
    color: 'bg-blue-500'
  },
  {
    id: 'points-250',
    name: 'Eco Millionaire',
    description: 'Earn 250 eco points',
    icon: '💸',
    color: 'bg-green-500'
  },
  
  // Ultimate achievements
  {
    id: 'all-topics',
    name: 'Climate Hero',
    description: 'Complete all available topics',
    icon: '🌍',
    color: 'bg-gradient-to-r from-green-600 to-blue-600'
  },
  {
    id: 'completionist',
    name: 'Completionist',
    description: 'Achieve 100% completion',
    icon: '👑',
    color: 'bg-gradient-to-r from-yellow-500 to-orange-600'
  },
  {
    id: 'eco-champion',
    name: 'Eco Champion',
    description: 'Earn all achievements',
    icon: '🏆',
    color: 'bg-gradient-to-r from-purple-600 to-pink-600'
  }
];

export const getAchievementById = (id: string): Omit<Achievement, 'earned'> | undefined => {
  return ACHIEVEMENT_DEFINITIONS.find(a => a.id === id);
};
