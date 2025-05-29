"use client"

import { useState, useEffect } from "react";
import { Mountain, Star, ChevronRight, ThumbsUp, ThumbsDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { db, auth } from "@/firebase/firebase";
import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { toast } from "sonner";

// Default state
const defaultState = {
  businessName: "DONER HUT",
  previewText: "How was your experience with Doner Hut?",
  previewImage: null as string | null,
  socialPreviewTitle: "Do you want to leave us a review?",
  reviewLinkUrl: "https://go.reviewuplift.com/doner-hut",
  isReviewGatingEnabled: true,
  rating: 0
}

// Decode state from URL-safe string
const decodeState = (encoded: string): typeof defaultState => {
  try {
    return JSON.parse(atob(encoded))
  } catch {
    return defaultState
  }
}

// Get state from multiple sources
const getPersistedState = (): typeof defaultState => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.replace('#', '')
    if (hash) {
      try {
        return { ...defaultState, ...decodeState(hash) }
      } catch {}
    }

    if ((window as any).reviewLinkState) {
      return { ...defaultState, ...(window as any).reviewLinkState }
    }
  }
  return defaultState
}

// Save state to multiple places
const persistState = (state: typeof defaultState) => {
  if (typeof window !== 'undefined') {
    (window as any).reviewLinkState = state
    try {
      const encoded = btoa(JSON.stringify(state))
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}#${encoded}`)
    } catch (error) {
      console.warn('Failed to persist state to URL:', error)
    }
  }
}

interface ReviewFormData {
  name: string
  phone: string
  email: string
  review: string
  rating: number
  businessId: string
  userId?: string
  status?: 'pending' | 'published' | 'rejected'
  createdAt?: any
  updatedAt?: any
}

interface LivePreviewProps {
  previewImage: string | null
  businessName: string
  previewText: string
  rating: number
  setRating: (rating: number) => void
  handleLeaveReview: (formData: ReviewFormData) => void
  businessId: string
}

const LivePreview: React.FC<LivePreviewProps> = ({
  previewImage,
  businessName,
  previewText,
  rating,
  setRating,
  handleLeaveReview,
  businessId
}) => {
  const [hoveredStar, setHoveredStar] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<Omit<ReviewFormData, 'rating' | 'businessId'>>({
    name: '',
    phone: '',
    email: '',
    review: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleReviewClick = async () => {
    if (rating === 0) return
    
    if (!showForm) {
      setShowForm(true)
      return
    }

    setIsSubmitting(true)
    try {
      await handleLeaveReview({
        ...formData,
        rating,
        businessId
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
      {/* Left Side - Image/Pattern */}
      <div className="w-full md:w-1/2 bg-gradient-to-b from-orange-50 to-orange-100 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNGRjk4MDAiIGZpbGwtb3BhY2l0eT0iMC40Ij48cGF0aCBkPSJNMCAwYzExLjA0NiAwIDIwIDguOTU0IDIwIDIwSDBWMHoiLz48cGF0aCBkPSJNNDAgNDBjLTExLjA0NiAwLTIwLTguOTU0LTIwLTIwSDB2MjBjMCAxMS4wNDYgOC45NTQgMjAgMjAgMjB6Ii8+PC9nPjwvZz48L3N2Zz4=')]"></div>
        <div className="relative h-full flex flex-col justify-center items-center p-8">
          {previewImage ? (
            <div className="w-full max-w-md aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={previewImage}
                alt={businessName}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          ) : (
            <div className="w-full max-w-md aspect-square rounded-2xl bg-white shadow-2xl flex items-center justify-center">
              <div className="text-center p-8">
                <Mountain className="h-20 w-20 mx-auto text-orange-500 mb-4" />
                <h3 className="text-2xl font-bold text-gray-800">{businessName}</h3>
              </div>
            </div>
          )}
          <div className="mt-8 text-center max-w-md">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">We value your opinion!</h3>
            <p className="text-lg text-gray-600">
              Share your dining experience and help us serve you better
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Review Form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Rate Your Experience</h2>
            <p className="text-gray-600">How was your visit to {businessName}?</p>
          </div>

          <div className="mb-8">
            <div className="flex justify-center space-x-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className={`p-2 rounded-full transition-all ${
                    star <= (hoveredStar || rating) ? 'bg-orange-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <Star
                    className={`h-10 w-10 ${
                      star <= (hoveredStar || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>

            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Not satisfied</span>
              <span>Very satisfied</span>
            </div>

            {rating > 0 && (
              <div className={`mt-6 p-4 rounded-lg bg-gray-50 border border-gray-200 animate-fadeIn`}>
                <p className="text-gray-700 font-medium text-center flex items-center justify-center">
                  {rating >= 4 ? (
                    <>
                      <ThumbsUp className="mr-2 text-green-500" />
                      We're glad you enjoyed your meal!
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="mr-2 text-orange-500" />
                      We're sorry to hear that. We'll use your feedback to improve.
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {showForm && (
            <div className="mb-6 space-y-4 animate-fadeIn">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="review" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Review
                </label>
                <textarea
                  id="review"
                  name="review"
                  rows={3}
                  value={formData.review}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  required
                ></textarea>
              </div>
            </div>
          )}

          <button
            onClick={handleReviewClick}
            disabled={rating === 0 || isSubmitting}
            className={`
              w-full py-4 px-6 rounded-lg font-medium text-white flex items-center justify-center
              transition-all duration-300
              ${rating === 0 || isSubmitting
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-md hover:shadow-lg'
              }
            `}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                {rating > 0 ? (showForm ? 'Submit Your Review' : 'Continue to Review') : 'Select a Rating to Continue'}
                <ChevronRight className="ml-2 h-5 w-5" />
              </>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-6 text-center">
            Powered by <span className="font-medium">ReviewUplift</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ReviewPage() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("")
  const [previewText, setPreviewText] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [reviewLinkUrl, setReviewLinkUrl] = useState("")
  const [isReviewGatingEnabled, setIsReviewGatingEnabled] = useState(true)
  const [rating, setRating] = useState(0)
  const [isStateLoaded, setIsStateLoaded] = useState(false)
  const [businessId, setBusinessId] = useState("")
  const [loading, setLoading] = useState(false)

  // Initialize state
  useEffect(() => {
    const loadInitialState = async () => {
      const persistedState = getPersistedState()
      setBusinessName(persistedState.businessName)
      setPreviewText(persistedState.previewText)
      setPreviewImage(persistedState.previewImage)
      setReviewLinkUrl(persistedState.reviewLinkUrl)
      setIsReviewGatingEnabled(persistedState.isReviewGatingEnabled)
      setRating(persistedState.rating || 0)
      
      // Get business ID from URL or user data
      const currentUser = auth.currentUser;
      if (currentUser) {
        try {
          const businessDoc = await getDoc(doc(db, "businesses", currentUser.uid));
          if (businessDoc.exists()) {
            setBusinessId(currentUser.uid);
            setBusinessName(businessDoc.data().businessName || persistedState.businessName);
          }
        } catch (error) {
          console.error("Error fetching business data:", error);
        }
      }
      
      setIsStateLoaded(true)
    }

    loadInitialState()
    const timeoutId = setTimeout(loadInitialState, 100)
    return () => clearTimeout(timeoutId)
  }, [])

  // Persist state
  useEffect(() => {
    if (isStateLoaded) {
      persistState({
        businessName,
        previewText,
        previewImage,
        socialPreviewTitle: "Do you want to leave us a review?",
        reviewLinkUrl,
        isReviewGatingEnabled,
        rating
      })
    }
  }, [businessName, previewText, previewImage, reviewLinkUrl, isReviewGatingEnabled, rating, isStateLoaded])

  // Handle review submission to Firebase
  const handleLeaveReview = async (formData: ReviewFormData) => {
    setLoading(true);
    const currentUser = auth.currentUser;
    
    if (!currentUser) {
      toast.error("You must be logged in to submit a review");
      setLoading(false);
      return;
    }

    try {
      // Save review to Firestore
      const reviewData = {
        ...formData,
        userId: currentUser.uid,
        status: 'pending', // Default status
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      // Add to reviews collection
      const reviewsRef = collection(db, "reviews");
      const newReviewRef = doc(reviewsRef);
      await setDoc(newReviewRef, reviewData);

      // Also add to business's reviews subcollection
      const businessReviewsRef = collection(db, "businesses", businessId, "reviews");
      await setDoc(doc(businessReviewsRef, newReviewRef.id), reviewData);

      toast.success("Review submitted successfully!");
      
      // Handle review gating
      if (isReviewGatingEnabled) {
        if (rating > 3) {
          window.open(reviewLinkUrl, "_blank")
        } else {
          const params = new URLSearchParams({
            rating: rating.toString(),
            business: businessName,
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            review: formData.review
          })
          navigate(`/feedback?${params.toString()}`)
        }
      } else {
        window.open(reviewLinkUrl, "_blank")
      }
    } catch (error: any) {
      console.error("Error submitting review:", error);
      toast.error("There was a problem submitting your review. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Add animations
  useEffect(() => {
    if (!document.getElementById('review-animations')) {
      const style = document.createElement('style')
      style.id = 'review-animations'
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `
      document.head.appendChild(style)
    }

    return () => {
      const styleElement = document.getElementById('review-animations')
      if (styleElement) styleElement.remove()
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4 sm:p-6 lg:p-8">
      <LivePreview
        previewImage={previewImage}
        businessName={businessName}
        previewText={previewText}
        rating={rating}
        setRating={setRating}
        handleLeaveReview={handleLeaveReview}
        businessId={businessId}
      />
    </div>
  )
}