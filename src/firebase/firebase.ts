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
  query,
  where,
  collection,
  getDocs,
  updateDoc,
  doc  // Added missing import
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

// Sign in with Google and set up user document
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check for duplicate emails
    const q = query(collection(db, "users"), where("email", "==", user.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      const existingUserDoc = querySnapshot.docs[0];
      if (existingUserDoc.id !== user.uid) {
        throw new Error("Email already exists. Please log in using your existing account.");
      }
    }

    // Create user document if not present
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
        role: "BUSER",
        createdAt: serverTimestamp(),
        businessFormFilled: false,
        businessId: user.uid,
      });
    }

    return user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Check if business form is filled
export const checkBusinessFormStatus = async (uid: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid,
        role: "BUSER",
        createdAt: serverTimestamp(),
        businessFormFilled: false,
        businessId: uid,
      });
      return {
        formFilled: false,
        businessId: uid,
      };
    }

    const userData = userDoc.data();
    return {
      formFilled: userData.businessFormFilled || false,
      businessId: userData.businessId || uid,
    };
  } catch (error) {
    console.error("Error checking business form status:", error);
    throw new Error("Failed to check business form status");
  }
};

// Create user document (used during registration or login)
export const initializeUserDocument = async (uid: string, email?: string) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      await setDoc(userRef, {
        uid,
        email: email || "",
        role: "BUSER",
        createdAt: serverTimestamp(),
        businessFormFilled: false,
        businessId: uid,
      });
    }
  } catch (error) {
    console.error("Error initializing user document:", error);
    throw error;
  }
};

// Save business form under /users/{uid}/business/main
export const createBusinessDocument = async (uid: string, businessData: any) => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    // Update or create user document
    if (userSnap.exists()) {
      await updateDoc(userRef, {
        businessFormFilled: true,
        updatedAt: serverTimestamp(),
      });
    } else {
      await setDoc(userRef, {
        uid,
        role: "BUSER",
        createdAt: serverTimestamp(),
        businessFormFilled: true,
        businessId: uid,
        updatedAt: serverTimestamp(),
      });
    }

    // Save to business subcollection
    const businessRef = doc(db, "users", uid, "business", "main");
    await setDoc(businessRef, {
      ...businessData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Business form saved under /users/{uid}/business/main");
  } catch (error) {
    console.error("❌ Error saving business form:", error);
    throw error;
  }
};

// Get business data from subcollection
export const getBusinessInfo = async (uid: string) => {
  try {
    const businessRef = doc(db, "users", uid, "business", "main");
    const businessSnap = await getDoc(businessRef);

    if (!businessSnap.exists()) {
      return null; // Return null instead of throwing error
    }

    return businessSnap.data();
  } catch (error) {
    console.error("Error fetching business info:", error);
    throw error;
  }
};

// Email/password authentication functions
export const emailSignUp = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await initializeUserDocument(userCredential.user.uid, email);
    return userCredential.user;
  } catch (error) {
    console.error("Email sign-up error:", error);
    throw error;
  }
};

export const emailSignIn = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Email sign-in error:", error);
    throw error;
  }
};