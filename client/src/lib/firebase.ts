import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  TwitterAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY || "",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || ""}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || "",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID || ""}.appspot.com`,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID || "",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Setup providers
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Send authentication data to our backend
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'google',
        },
        token
      })
    });
    
    return user;
  } catch (error: any) {
    throw new Error(`Google sign-in error: ${error.message}`);
  }
};

export const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider);
    const user = result.user;
    const credential = TwitterAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken;
    
    // Send authentication data to our backend
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'twitter',
        },
        token
      })
    });
    
    return user;
  } catch (error: any) {
    throw new Error(`Twitter sign-in error: ${error.message}`);
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Send authentication data to our backend
    await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          provider: 'email',
        }
      })
    });
    
    return user;
  } catch (error: any) {
    throw new Error(`Email sign-in error: ${error.message}`);
  }
};

export const createUserWithEmail = async (email: string, password: string, displayName: string) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    // Send account creation data to our backend
    await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user: {
          uid: user.uid,
          email: user.email,
          displayName,
          provider: 'email',
        }
      })
    });
    
    return user;
  } catch (error: any) {
    throw new Error(`Account creation error: ${error.message}`);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    // Notify backend about logout
    await fetch('/api/auth/logout', { method: 'POST' });
  } catch (error: any) {
    throw new Error(`Sign out error: ${error.message}`);
  }
};

export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
};

export { auth };
