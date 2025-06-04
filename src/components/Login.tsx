// // src/components/LoginForm.tsx
// import React, { useState, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { FcGoogle } from "react-icons/fc";
// import { auth, db, signInWithGoogle } from "../firebase/firebase";
// import { signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// export default function LoginForm() {
//   const [showEmailForm, setShowEmailForm] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // As soon as this component mounts, clear any previously stored "uid".
//   // That way, even if the user clicked "Logout" elsewhere and got sent back here,
//   // we make sure no old uid remains in localStorage.
//   useEffect(() => {
//     localStorage.removeItem("uid");
//   }, []);

//   /**
//    * After a successful login, we check if the user has already filled out their business form.
//    * If so, redirect to "/components/business/dashboard".
//    * Otherwise, redirect to "/businessform".
//    */
//   const redirectBasedOnFormStatus = async (uid: string) => {
//     const businessRef = doc(db, "users", uid);
//     const businessSnap = await getDoc(businessRef);

//     if (businessSnap.exists()) {
//       const businessData = businessSnap.data();
//       if (businessData.businessFormFilled === true) {
//         window.location.href = "/components/business/dashboard";
//       } else {
//         window.location.href = "/businessform";
//       }
//     } else {
//       window.location.href = "/businessform";
//     }
//   };

//   /**
//    * Handle Email/Password login.
//    * - Sign in via Firebase Auth
//    * - Verify that the user's role === "BUSER"
//    * - Store role, email, AND uid in localStorage
//    * - Then redirect appropriately
//    */
//   const handleEmailLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       const uid = userCredential.user.uid;

//       // Fetch the "users/{uid}" document from Firestore
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         throw new Error("User data not found.");
//       }

//       const userData = userSnap.data();

//       // Only allow role === "BUSER"
//       if (userData.role !== "BUSER") {
//         throw new Error("Access denied: only BUSER role allowed");
//       }

//       // Store role, email, and uid in localStorage
//       localStorage.setItem("role", userData.role);
//       localStorage.setItem("email", userData.email);
//       localStorage.setItem("uid", uid);

//       // Redirect based on whether businessFormFilled is true/false
//       await redirectBasedOnFormStatus(uid);
//     } catch (err: any) {
//       setError(err.message || "Login failed.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Handle Google Sign‐In.
//    * - Use your existing signInWithGoogle() helper that calls Firebase Auth.
//    * - After sign‐in, get currentUser.uid, verify role in Firestore.
//    * - If role !== "BUSER", error out.
//    * - Otherwise, store role, email, AND uid in localStorage, then redirect.
//    */
//   const handleGoogleLogin = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       await signInWithGoogle();

//       const currentUser = auth.currentUser;
//       const uid = currentUser?.uid;
//       if (!uid) throw new Error("User not authenticated");

//       // Fetch the "users/{uid}" document from Firestore
//       const userRef = doc(db, "users", uid);
//       const userSnap = await getDoc(userRef);

//       if (!userSnap.exists()) {
//         throw new Error("User data not found.");
//       }

//       const userData = userSnap.data();
//       if (userData.role !== "BUSER") {
//         throw new Error("Access denied: only BUSER role allowed");
//       }

//       // Store role, email, and uid in localStorage
//       localStorage.setItem("role", userData.role);
//       localStorage.setItem("email", userData.email || "");
//       localStorage.setItem("uid", uid);

//       // Redirect based on whether businessFormFilled is true/false
//       await redirectBasedOnFormStatus(uid);
//     } catch (err: any) {
//       setError(err.message || "Google sign-in failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-orange-50">
//       <Card className="w-full max-w-md shadow-lg rounded-2xl p-6 bg-white">
//         <CardContent>
//           <h2 className="text-2xl font-bold text-gray-600 mb-6 text-center">
//             Sign In to Your Account
//           </h2>

//           <Button
//             variant="outline"
//             className="w-full mb-4 flex items-center justify-center gap-2 border-orange-500 text-orange-600 hover:bg-orange-100"
//             onClick={handleGoogleLogin}
//             disabled={loading}
//           >
//             <FcGoogle size={20} /> Continue with Google
//           </Button>

//           {!showEmailForm && (
//             <Button
//               variant="outline"
//               className="w-full mb-4 border-gray-300 text-gray-700 hover:bg-orange-100"
//               onClick={() => setShowEmailForm(true)}
//             >
//               Continue with Email
//             </Button>
//           )}

//           {showEmailForm && (
//             <>
//               <div className="flex items-center my-4">
//                 <div className="flex-grow border-t border-gray-300" />
//                 <span className="mx-4 text-gray-400 text-sm">or</span>
//                 <div className="flex-grow border-t border-gray-300" />
//               </div>

//               <form className="space-y-4" onSubmit={handleEmailLogin}>
//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Email</label>
//                   <Input
//                     type="email"
//                     required
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 <div>
//                   <label className="text-sm text-gray-600 block mb-1">Password</label>
//                   <Input
//                     type="password"
//                     required
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                   />
//                 </div>

//                 {error && <p className="text-red-500 text-sm text-center">{error}</p>}

//                 <Button
//                   type="submit"
//                   className="w-full bg-orange-600 hover:bg-orange-700"
//                   disabled={loading}
//                 >
//                   {loading ? "Signing In..." : "Sign In"}
//                 </Button>
//               </form>
//             </>
//           )}

//           <p className="mt-6 text-sm text-center text-gray-600">
//             Don’t have an account?{" "}
//             <a href="/register" className="text-orange-600 font-medium hover:underline">
//               Register here
//             </a>
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
// src/components/LoginForm.tsx
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FcGoogle } from "react-icons/fc";
import { auth, db, signInWithGoogle } from "../firebase/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem("uid");
    localStorage.removeItem("role");
  }, []);

  const redirectUser = async (uid: string, role: string) => {
    if (role === "ADMIN") {
      navigate("/components/admin/dashboard");
    } else if (role === "BUSER") {
      const businessRef = doc(db, "users", uid);
      const businessSnap = await getDoc(businessRef);

      if (businessSnap.exists()) {
        const businessData = businessSnap.data();
        if (businessData.businessFormFilled === true) {
          navigate("/components/business/dashboard");
        } else {
          navigate("/businessform");
        }
      } else {
        navigate("/businessform");
      }
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found.");
      }

      const userData = userSnap.data();

      // Store role, email, and uid in localStorage
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("uid", uid);

      await redirectUser(uid, userData.role);
    } catch (err: any) {
      setError(err.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      const currentUser = auth.currentUser;
      const uid = currentUser?.uid;
      if (!uid) throw new Error("User not authenticated");

      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        throw new Error("User data not found.");
      }

      const userData = userSnap.data();
      
      // Store role, email, and uid in localStorage
      localStorage.setItem("role", userData.role);
      localStorage.setItem("email", userData.email || "");
      localStorage.setItem("uid", uid);

      await redirectUser(uid, userData.role);
    } catch (err: any) {
      setError(err.message || "Google sign-in failed");
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

          <div className="mt-6 text-sm text-center text-gray-600">
            <p>
              Don't have an account?{" "} 
              <br/>
              <a href="/register" className="text-orange-600 font-medium hover:underline">
                Register as Business
              </a>{" "}
              or{" "}
              <a href="/components/admin/register" className="text-orange-600 font-medium hover:underline">
                Register as Admin
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}