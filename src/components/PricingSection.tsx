// src/pages/PricingSection.tsx

import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PricingSection = () => {
  const navigate = useNavigate();

  const handleContactClick = () => {
    navigate("/contact");
  };

  const plans = [
    {
      name: "Starter",
      price: "$49",
      description:
        "Perfect for small businesses just getting started with review management.",
      features: [
        "1 Business Location",
        "100 Review Requests/Month",
        "Review Monitoring (3 Sites)",
        "Basic Review Widgets",
        "Email Support",
        "Mobile App Access",
      ],
      cta: "Start Free Trial",
      popular: false,
    },
    {
      name: "Professional",
      price: "$99",
      description:
        "Ideal for growing businesses that need more advanced features.",
      features: [
        "3 Business Locations",
        "500 Review Requests/Month",
        "Review Monitoring (10 Sites)",
        "Advanced Review Widgets",
        "Custom Branding",
        "Priority Email Support",
        "Review Campaigns",
        "API Access",
      ],
      cta: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description:
        "For large businesses with multiple locations and advanced needs.",
      features: [
        "Unlimited Business Locations",
        "Unlimited Review Requests",
        "Review Monitoring (100+ Sites)",
        "Premium Review Widgets",
        "White-labeled Solution",
        "Dedicated Account Manager",
        "Custom Integration",
        "Advanced Analytics",
      ],
      cta: "Contact Sales",
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <p className="text-base text-orange-600 font-semibold tracking-wide uppercase">
            Pricing
          </p>
          <h2 className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Choose the plan that's right for your business. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-lg overflow-hidden transition-transform duration-300 hover:-translate-y-2 ${
                plan.popular ? "ring-2 ring-orange-600 relative" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-orange-600 text-white text-xs font-bold px-3 py-1 transform translate-x-2 -translate-y-2 rotate-45">
                  Popular
                </div>
              )}
              <div className="px-6 py-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-gray-500 ml-1">/month</span>}
                </div>
                <p className="mt-4 text-gray-500">{plan.description}</p>

                <Button
                  className={`mt-8 w-full py-6 ${
                    plan.popular
                      ? "bg-orange-600 hover:bg-orange-700"
                      : "bg-orange-600 hover:bg-orange-700"
                  }`}
                  onClick={() => {
                    if (plan.cta === "Contact Sales") {
                      handleContactClick();
                    } else {
                      navigate("/payment", {
                        state: {
                          planName: plan.name,
                          price: plan.price,
                        },
                      });
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </div>
              <div className="px-6 pt-6 pb-8 bg-gray-50 border-t border-gray-100">
                <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">
                  What's included
                </h4>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex">
                      <CheckIcon className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="ml-3 text-gray-500">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-white rounded-lg shadow-md p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900">Need a custom solution?</h3>
            <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
              Contact our sales team to get a custom quote for your specific needs. We offer flexible
              pricing for agencies and multi-location businesses.
            </p>
            <div className="mt-8">
              <Button onClick={handleContactClick} className="bg-orange-600 hover:bg-orange-700">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
