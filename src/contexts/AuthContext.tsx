import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signup: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Create user profile in Firestore with first level of each topic unlocked (0 lessons completed)
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      name,
      email,
      ecoPoints: 0,
      maxPoints: 1000,
      createdAt: new Date().toISOString(),
      achievements: [],
      levelProgress: {
        1: "unlocked" // First level is unlocked by default (legacy)
      },
      topicProgress: {
        'e-waste': {
          1: 0 // 0 lessons completed, but level is accessible
        },
        'temperature-change': {
          1: 0 // 0 lessons completed, but level is accessible
        }
      },
      topicCorrectAnswers: {
        'e-waste': {
          1: 0
        },
        'temperature-change': {
          1: 0
        }
      },
      streak: 1,
      lastLoginDate: today
    });
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
