"use client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  auth,
  signInWithGoogle,
  getUserData,
  emailSignUp,
  initializeUserDocument
} from "../firebase/firebase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function RegistrationForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Basic validation
      if (!username.trim() || !email.trim() || !password) {
        throw new Error("All fields are required");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters");
      }

      // Create account
      const user = await emailSignUp(email, password);
      const uid = user.uid;

      // Initialize user profile
      await initializeUserDocument(uid, email, username);

      // Redirect based on business status
      const userData = await getUserData(uid);
      userData?.businessFormFilled
        ? navigate("/components/business/dashboard")
        : navigate("/businessform");

      toast.success("Account created successfully!");
    } catch (err: any) {
      console.error("Registration error:", err);
      const errorMsg = err.code === "auth/email-already-in-use" 
        ? "Email already registered" 
        : err.message || "Registration failed";
      
      setError(errorMsg);
      toast.error(errorMsg);
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
      if (!uid) throw new Error("Authentication failed");

      // Redirect based on business status
      const userData = await getUserData(uid);
      userData?.businessFormFilled
        ? navigate("/components/business/dashboard")
        : navigate("/businessform");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      setError(err.message || "Google sign-in failed");
      toast.error(err.message || "Google sign-in failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-600 mb-2">Get Started</h1>
          <p className="text-gray-600">Create your business account</p>
        </div>

        <div className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 flex items-center justify-center gap-3 border-orange-500 text-orange-600 hover:bg-orange-50 transition-colors"
            onClick={handleGoogleRegister}
            disabled={loading}
          >
            <FcGoogle size={24} /> 
            <span className="font-medium">Continue with Google</span>
          </Button>

          {!showEmailForm ? (
            <>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-400 text-sm">OR</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <Button
                variant="default"
                className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium"
                onClick={() => setShowEmailForm(true)}
                disabled={loading}
              >
                Continue with Email
              </Button>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-400 text-sm">ENTER YOUR DETAILS</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <form className="space-y-5" onSubmit={handleRegister}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Username
                  </label>
                  <Input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="h-12 text-base"
                    placeholder="Your business username"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 text-base"
                    placeholder="contact@business.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 text-base"
                    placeholder="••••••••"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Minimum 6 characters
                  </p>
                </div>

                {error && (
                  <div className="text-red-500 text-sm text-center py-2 px-4 bg-red-50 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-medium text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
            </motion.div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <a 
              href="/login" 
              className="font-medium text-orange-600 hover:text-orange-700 transition-colors"
            >
              Sign in
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-4">
            By registering, you agree to our{" "}
            <a href="#" className="text-orange-600 hover:underline">Terms</a> and{" "}
            <a href="#" className="text-orange-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}