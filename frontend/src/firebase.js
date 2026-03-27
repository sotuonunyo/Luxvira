import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';

// 🔐 REPLACE WITH YOUR ACTUAL FIREBASE CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyBUPTerCYPEAZVsgNtoAndGZKSwkTTgstA",
  authDomain: "luxvira-scents-admin.firebaseapp.com",
  projectId: "luxvira-scents-admin",
  storageBucket: "luxvira-scents-admin.appspot.com",
  messagingSenderId: "702571915333",
  appId: "1:702571915333:web:7c510a24e1d781ab8a1b2c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const ALLOWED_ADMIN_EMAILS = ['luxvirascents@gmail.com', 's.otuonunyo@gmail.com'];
export const isAdminEmail = (email) => ALLOWED_ADMIN_EMAILS.includes(email?.toLowerCase());

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    if (!isAdminEmail(user.email)) {
      await signOut(auth);
      return { success: false, error: 'Access denied. Authorized accounts only.' };
    }
    return { success: true, user: { email: user.email, name: user.displayName, photo: user.photoURL } };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

export const signOutUser = async () => { await signOut(auth); };

export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, (user) => {
    if (user && isAdminEmail(user.email)) {
      callback({ loggedIn: true, user: { email: user.email, name: user.displayName, photo: user.photoURL } });
    } else {
      callback({ loggedIn: false, user: null });
    }
  });
};

export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user && isAdminEmail(user.email)) {
    return { email: user.email, name: user.displayName, photo: user.photoURL };
  }
  return null;
};
