import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  type Auth,
  type UserCredential,
} from "firebase/auth";

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain:
    process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ||
    `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studiospace-client-513508"}.firebaseapp.com`,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studiospace-client-513508",
  storageBucket:
    process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ||
    `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "studiospace-client-513508"}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "199695232756",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

export function isFirebaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY.trim().length > 0
  );
}

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

export function getFirebaseServices(): {
  app: FirebaseApp | undefined;
  auth: Auth | undefined;
  googleProvider: GoogleAuthProvider | undefined;
} {
  if (typeof window === "undefined") {
    return { app: undefined, auth: undefined, googleProvider: undefined };
  }

  if (!app) {
    if (getApps().length > 0) {
      app = getApp();
    } else if (isFirebaseConfigured()) {
      try {
        app = initializeApp(firebaseConfig);
      } catch (err) {
        console.warn("[Firebase] Failed to initialize Firebase App:", err);
      }
    }
  }

  if (app && !auth) {
    try {
      auth = getAuth(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
    } catch (err) {
      console.warn("[Firebase] Failed to initialize Firebase Auth:", err);
    }
  }

  return { app, auth, googleProvider };
}

/**
 * Initiates primary Firebase Google Sign-In with popup
 * Returns the authenticated UserCredential containing Google profile and ID token
 */
export async function signInWithFirebaseGoogle(): Promise<UserCredential> {
  const { auth, googleProvider } = getFirebaseServices();

  if (!auth || !googleProvider) {
    throw new Error(
      "Firebase is not configured. Please supply NEXT_PUBLIC_FIREBASE_API_KEY and NEXT_PUBLIC_FIREBASE_PROJECT_ID in your environment."
    );
  }

  return await signInWithPopup(auth, googleProvider);
}

export async function signOutFirebase(): Promise<void> {
  const { auth } = getFirebaseServices();
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch {
      // Graceful ignore
    }
  }
}
