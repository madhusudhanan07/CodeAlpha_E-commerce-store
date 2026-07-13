/**
 * AuthContext.tsx — Firebase Authentication Context
 *
 * Provides global auth state to the entire React tree.
 *
 * Exposes:
 *  - currentUser    → Firebase User object (or null)
 *  - loading        → true while the initial auth state is resolving
 *  - isAuthenticated → shorthand boolean
 *  - register()     → create account via Firebase + sync to MySQL
 *  - login()        → sign in via Firebase
 *  - logout()       → sign out from Firebase
 *
 * Usage: wrap your app in <AuthProvider>, then call useAuth() anywhere.
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';
import axiosInstance from '../services/axiosInstance';

// ── Context Shape ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  currentUser:     FirebaseUser | null;
  loading:         boolean;
  isAuthenticated: boolean;
  register:  (fullName: string, email: string, password: string) => Promise<void>;
  login:     (email: string, password: string) => Promise<void>;
  logout:    () => Promise<void>;
}

// ── Context ───────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ── Provider ──────────────────────────────────────────────────────────────────

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading]         = useState(true);

  // ── Listen for Firebase auth state changes ────────────────────────────────
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    // Cleanup listener when component unmounts
    return unsubscribe;
  }, []);

  // ── register ──────────────────────────────────────────────────────────────
  const register = async (
    fullName: string,
    email: string,
    password: string,
  ): Promise<void> => {
    // Step 1: Create Firebase account
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Step 2: Set Firebase displayName
    await updateProfile(credential.user, { displayName: fullName });

    // Step 3: Sync user to MySQL via backend
    const token = await credential.user.getIdToken();
    await axiosInstance.post(
      '/api/auth/register',
      {
        name:        fullName,
        email:       credential.user.email,
        firebaseUid: credential.user.uid,
      },
      { headers: { Authorization: `Bearer ${token}` } },
    );
  };

  // ── login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string): Promise<void> => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  // ── logout ────────────────────────────────────────────────────────────────
  const logout = async (): Promise<void> => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAuthenticated: !!currentUser,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ── Consumer Hook ─────────────────────────────────────────────────────────────

/**
 * useAuth — consume the AuthContext from any component.
 * Must be rendered inside <AuthProvider>.
 */
export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
};

export default AuthContext;
