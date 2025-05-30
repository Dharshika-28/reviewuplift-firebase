import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  getFirestore,
  setDoc,
  getDoc,
  serverTimestamp,
  doc,
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLew3ixW5fTSOBy6oFMb8U-t4UnF9cMBU",
  authDomain: "reviewuplift-378f0.firebaseapp.com",
  projectId: "reviewuplift-378f0",
  storageBucket: "reviewuplift-378f0.appspot.com",
  messagingSenderId: "149869204343",
  appId: "1:149869204343:web:0462b498a7b478186b8772",
  measurementId: "G-TS1H91W493",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
const provider = new GoogleAuthProvider();

// Google Sign-In
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    await initializeUserDocument(user.uid, user.email, user.displayName);
    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Create/initialize user document
export const initializeUserDocument = async (
  uid: string,
  email?: string | null,
  displayName?: string | null
) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid,
        email: email || "",
        displayName: displayName || "",
        role: "BUSER",
        createdAt: serverTimestamp(),
        businessFormFilled: false,
        businessInfo: null, // FIX: Initialize as null
      });
    }

    return userSnap;
  } catch (error) {
    console.error("Error initializing user document:", error);
    throw error;
  }
};

// Check business form status
export const checkBusinessFormStatus = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return { formFilled: false, businessData: null };
    }

    const userData = userSnap.data();
    return {
      formFilled: userData.businessFormFilled || false,
      businessData: userData.businessInfo || null,
    };
  } catch (error) {
    console.error("Error checking business form status:", error);
    return { formFilled: false, businessData: null };
  }
};

// Save business information
export const createBusinessDocument = async (uid: string, businessData: any) => {
  try {
    const userRef = doc(db, "users", uid);
    await setDoc(
      userRef,
      {
        businessFormFilled: true, // Ensure this is at root level
        businessInfo: {
          ...businessData,
          emailVerified: auth.currentUser?.emailVerified || false,
          phoneVerified: businessData.phoneVerified
        },
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log("✅ Business data saved to user document");
    return businessData;
  } catch (error) {
    console.error("❌ Error saving business data:", error);
    throw error;
  }
};

// Email/password sign-up
export const emailSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    await initializeUserDocument(userCredential.user.uid, email);
    return userCredential.user;
  } catch (error) {
    console.error("Email sign-up error:", error);
    throw error;
  }
};

// Email/password sign-in
export const emailSignIn = async (email: string, password: string) => {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.error("Email sign-in error:", error);
    throw error;
  }
};

// Get complete user data
export const getUserData = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() : null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
