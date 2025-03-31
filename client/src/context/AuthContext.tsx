import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { 
  signInWithGoogle, 
  signInWithTwitter,
  signInWithEmail,
  createUserWithEmail,
  signOut as firebaseSignOut,
  getCurrentUser
} from "@/lib/firebase";

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithTwitter: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check authentication state on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          });
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Login with email and password
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmail(email, password);
      setUser({
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: userCredential.displayName,
        photoURL: userCredential.photoURL,
      });
    } catch (error) {
      throw error;
    }
  };

  // Register with email and password
  const register = async (email: string, password: string, name: string) => {
    try {
      const userCredential = await createUserWithEmail(email, password, name);
      setUser({
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: name,
        photoURL: userCredential.photoURL,
      });
    } catch (error) {
      throw error;
    }
  };

  // Sign in with Google
  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithGoogle();
      setUser({
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: userCredential.displayName,
        photoURL: userCredential.photoURL,
      });
    } catch (error) {
      throw error;
    }
  };

  // Sign in with Twitter
  const handleTwitterSignIn = async () => {
    try {
      const userCredential = await signInWithTwitter();
      setUser({
        uid: userCredential.uid,
        email: userCredential.email,
        displayName: userCredential.displayName,
        photoURL: userCredential.photoURL,
      });
    } catch (error) {
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await firebaseSignOut();
      setUser(null);
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    signInWithGoogle: handleGoogleSignIn,
    signInWithTwitter: handleTwitterSignIn,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
