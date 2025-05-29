import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// Define types for better type safety
type PaymentOption = {
  id: string;
  name: string;
  logo: string;
};

type RazorpayResponse = {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
};

declare global {
  interface Window {
    Razorpay: {
      new (options: RazorpayOptions): RazorpayInstance;
    };
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  image: string;
  order_id?: string;
  handler: (response: RazorpayResponse) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}

interface RazorpayInstance {
  open: () => void;
  close: () => void;
}

const paymentOptions: PaymentOption[] = [
  { id: "gpay", name: "Google Pay", logo: "/images/gpay.png" },
  { id: "paytm", name: "Paytm", logo: "/images/paytm.png" },
  { id: "phonepe", name: "PhonePe", logo: "/images/phonepe.png" },
  { id: "netbanking", name: "Net Banking", logo: "/images/netbanking.png" },
];

// Define pricing plans with their respective prices
const pricingPlans = [
  { id: "basic", name: "Basic", price: 299 },
  { id: "standard", name: "Standard", price: 599 },
  { id: "premium", name: "Premium", price: 999 },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { planId } = location.state || {};
  const [selectedOption, setSelectedOption] = useState("gpay");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Find the selected plan based on planId
  const selectedPlan = pricingPlans.find(plan => plan.id === planId) || pricingPlans[0];
  const planName = selectedPlan.name;
  const price = selectedPlan.price;

  // Load Razorpay script dynamically
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise<void>((resolve) => {
        if (window.Razorpay) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => {
          setError("Failed to load Razorpay SDK");
          resolve();
        };
        document.body.appendChild(script);
      });
    };

    loadRazorpay();
  }, []);

  const handlePayment = async () => {
    if (!price || !planName) {
      setError("Plan information is missing");
      return;
    }

    if (!window.Razorpay) {
      setError("Razorpay payment system is not available");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const amountInPaise = Math.round(Number(price) * 100);

      // In a real app, you would fetch this from your backend
      const options: RazorpayOptions = {
        key: "rzp_test_5Liv4sRSmiSdzx", // Replace with your actual test key
        amount: amountInPaise,
        currency: "INR",
        name: "TripSync",
        description: `Subscription to ${planName}`,
        image: "/logo192.png",
        handler: function (response: RazorpayResponse) {
          // In a real app, you would verify the payment signature with your backend
          alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
          navigate("/payment-success", {
            state: {
              paymentId: response.razorpay_payment_id,
              planName,
              price,
            },
          });
        },
        prefill: {
          name: "User Name", // You can get this from user profile
          email: "user@example.com", // You can get this from user profile
          contact: "9999999999", // You can get this from user profile
        },
        theme: {
          color: "#f97316", // Orange color matching your button
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError("Failed to initialize payment. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!planName || !price) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Plan Information Missing</h2>
          <p className="text-gray-600 mb-6">
            Please select a plan before proceeding to payment.
          </p>
          <Button
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => navigate("/pricing")}
          >
            Back to Pricing
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-xl shadow-xl p-10 w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Subscribe to {planName} Plan
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Your 14-day trial has ended. Please choose a payment method below.
        </p>

        <div className="text-center text-2xl font-semibold text-gray-900 mb-8">
          ₹{price} / month
        </div>

        <div className="grid grid-cols-2 gap-6 mb-8">
          {paymentOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOption(option.id)}
              disabled={isLoading}
              className={`flex items-center border rounded-lg p-4 transition hover:shadow-md focus:outline-none justify-center gap-4 ${
                selectedOption === option.id
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300"
              } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              <img src={option.logo} alt={option.name} className="h-8 w-8" />
              <span className="text-gray-800 font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-center">
            {error}
          </div>
        )}

        <Button
          className="w-full bg-orange-600 hover:bg-orange-700"
          onClick={handlePayment}
          disabled={isLoading || !window.Razorpay}
        >
          {isLoading ? (
            "Processing..."
          ) : (
            <>
              Pay with Razorpay ({paymentOptions.find((p) => p.id === selectedOption)?.name})
            </>
          )}
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Secure payments powered by Razorpay
        </p>
      </div>
    </div>
  );
};

export default PaymentPage;