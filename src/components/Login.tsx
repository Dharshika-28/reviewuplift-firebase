"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { auth, signInWithGoogle, getUserData } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function LoginForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRedirect = async (uid: string) => {
    try {
      const userData = await getUserData(uid);
      if (userData?.businessFormFilled) {
        navigate("/components/business/dashboard");
      } else {
        navigate("/businessform");
      }
    } catch (error) {
      console.error("Redirect error:", error);
      toast.error("Failed to determine redirect path");
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      await handleRedirect(uid);
    } catch (err: any) {
      console.error("Email login error:", err);
      const errorMessage = err.message || "Login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      const uid = auth.currentUser?.uid;

      if (!uid) throw new Error("User not authenticated");
      await handleRedirect(uid);
    } catch (err: any) {
      console.error("Google login error:", err);
      const errorMessage = err.message || "Google sign-in failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50">
      <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-white">
        <CardContent>
          <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
            Sign In to Your Account
          </h2>

          <Button
            variant="outline"
            className="w-full mb-4 flex items-center justify-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-100"
            onClick={handleGoogleLogin}
            disabled={loading}
          >
            <FcGoogle size={20} /> Continue with Google
          </Button>

          {!showEmailForm && (
            <Button
              variant="outline"
              className="w-full mb-4 border-gray-300 text-gray-700 hover:bg-orange-100"
              onClick={() => setShowEmailForm(true)}
              disabled={loading}
            >
              Continue with Email
            </Button>
          )}

          {showEmailForm && (
            <>
              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300" />
                <span className="mx-4 text-gray-400 text-sm">or</span>
                <div className="flex-grow border-t border-gray-300" />
              </div>

              <form className="space-y-4" onSubmit={handleEmailLogin}>
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
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </>
          )}

          <p className="mt-6 text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a href="/register" className="text-orange-600 font-medium hover:underline">
              Register here
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}