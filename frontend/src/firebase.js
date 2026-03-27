// Firebase configuration and auth utilities
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';

// 🔐 YOUR FIREBASE CONFIG - Replace with actual values from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBUPTerCYPEAZVsgNtoAndGZKSwkTTgstA",
  authDomain: "luxvira-scents-admin.firebaseapp.com",
  projectId: "luxvira-scents-admin",
  storageBucket: "luxvira-scents-admin.appspot.com",
  messagingSenderId: "702571915333",
  appId: "1:702571915333:web:7c510a24e1d781ab8a1b2c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Allowed admin emails (ONLY these can access admin panel)
export const ALLOWED_ADMIN_EMAILS = [
  'luxvirascents@gmail.com',
  's.otuonunyo@gmail.com'
];

// Check if email is allowed
export const isAdminEmail = (email) => {
  return ALLOWED_ADMIN_EMAILS.includes(email?.toLowerCase());
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    if (!isAdminEmail(user.email)) {
      await signOut(auth);
      return { 
        success: false, 
        error: 'Access denied. Only authorized accounts can access admin panel.' 
      };
    }
    
    return { 
      success: true, 
      user: {
        email: user.email,
        name: user.displayName,
        photo: user.photoURL
      }
    };
  } catch (error) {
    console.error('Google sign-in error:', error);
    return { success: false, error: error.message };
  }
};

// Sign out
export const signOutUser = async () => {
  await signOut(auth);
};

// Listen to auth state changes
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && isAdminEmail(user.email)) {
      callback({
        loggedIn: true,
        user: {
          email: user.email,
          name: user.displayName,
          photo: user.photoURL
        }
      });
    } else {
      callback({ loggedIn: false, user: null });
    }
  });
};

// ✅ Get current user (sync check) - EXPORTED
export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user && isAdminEmail(user.email)) {
    return {
      email: user.email,
      name: user.displayName,
      photo: user.photoURL
    };
  }
  return null;
};
