"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  auth,
  db,
  initializeUserDocument,
  signInWithGoogle,
  getUserData,
} from "../firebase/firebase";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { toast } from "sonner";

export default function RegistrationForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      const q = query(collection(db, "users"), where("email", "==", email));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      console.error("Email check failed:", err);
      return false;
    }
  };

  const checkUsernameExists = async (username: string): Promise<boolean> => {
    try {
      const q = query(collection(db, "users"), where("username", "==", username));
      const snapshot = await getDocs(q);
      return !snapshot.empty;
    } catch (err) {
      console.error("Username check failed:", err);
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!username || !email || !password) {
        throw new Error("All fields are required.");
      }

      const usernameTaken = await checkUsernameExists(username);
      if (usernameTaken) throw new Error("Username already exists");

      const emailTaken = await checkEmailExists(email);
      if (emailTaken) throw new Error("Email already registered");

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      await initializeUserDocument(uid, email, username);

      toast.success("Account created successfully!");
      navigate("/businessform");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setLoading(true);

    try {
      const user = await signInWithGoogle();
      const uid = user?.uid || auth.currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");

      const userData = await getUserData(uid);

      if (userData?.businessFormFilled) {
        navigate("/components/business/dashboard");
      } else {
        navigate("/businessform");
      }
    } catch (err: any) {
      console.error("Google registration error:", err);
      setError(err.message || "Google sign-in failed");
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f8fa]">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        <h2 className="text-2xl font-semibold text-orange-600 text-center mb-6">
          Create your account
        </h2>

        <Button
          variant="outline"
          className="w-full mb-4 flex items-center justify-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-100"
          onClick={handleGoogleRegister}
          disabled={loading}
        >
          <FcGoogle size={20} /> Continue with Google
        </Button>

        {!showEmailForm && (
          <Button
            variant="outline"
            className="w-full border-gray-300 text-gray-700 hover:bg-orange-50"
            onClick={() => setShowEmailForm(true)}
            disabled={loading}
          >
            Continue with Email
          </Button>
        )}

        {showEmailForm && (
          <>
            <div className="flex items-center my-4">
              <hr className="flex-grow border-gray-300" />
              <span className="mx-3 text-gray-400 text-sm">or</span>
              <hr className="flex-grow border-gray-300" />
            </div>

            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Username</label>
                <Input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm text-gray-600 block mb-1">Password</label>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {error && <p className="text-red-500 text-sm text-center">{error}</p>}

              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>
          </>
        )}

        <p className="text-xs text-gray-500 text-center mt-4">
          By signing up, you agree to our{" "}
          <a href="#" className="text-orange-600 hover:underline">Terms</a> and{" "}
          <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>.
        </p>

        <p className="text-sm text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
