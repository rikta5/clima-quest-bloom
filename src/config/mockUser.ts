export interface Achievement {
  id: string;
  name: string;
  icon: string;
  color: string;
  earned: boolean;
  description?: string;
  earnedAt?: string;
}

export interface MockUser {
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  ecoPoints: number;
  maxPoints: number;
  achievements: Achievement[];
}

export const mockUser: MockUser = {
  name: "Eco Learner",
  email: "user@example.com",
  phone: "+1 (555) 123-4567",
  avatarInitials: "EL",
  ecoPoints: 273,
  maxPoints: 1000,
  achievements: [
    {
      id: "first-steps",
      name: "First Steps",
      icon: "🌱",
      color: "bg-accent text-accent-foreground",
      earned: true
    },
    {
      id: "data-explorer",
      name: "Data Explorer",
      icon: "📊",
      color: "bg-blue text-white",
      earned: true
    },
    {
      id: "quiz-streak",
      name: "Quiz Streak",
      icon: "🔥",
      color: "bg-orange text-white",
      earned: true
    },
    {
      id: "eco-champion",
      name: "Eco Champion",
      icon: "🏆",
      color: "bg-primary text-primary-foreground",
      earned: true
    },
    {
      id: "knowledge-keeper",
      name: "Knowledge Keeper",
      icon: "📚",
      color: "bg-muted text-muted-foreground",
      earned: false
    },
    {
      id: "climate-hero",
      name: "Climate Hero",
      icon: "⭐",
      color: "bg-muted text-muted-foreground",
      earned: false
    }
  ]
};
