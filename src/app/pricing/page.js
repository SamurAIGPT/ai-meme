"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";

export default function PricingPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(null);

  const handleCheckout = async (planId) => {
    if (!session) {
      signIn("google");
      return;
    }

    try {
      setLoading(planId);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });

      if (!res.ok) throw new Error("Failed to create checkout");

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
      alert("Checkout error. Please try again.");
    } finally {
      setLoading(null);
    }
  };

  const plans = [
    {
      id: "starter",
      name: "Starter Pack",
      price: "$5.00",
      credits: 1000,
      description: "Great for trying out AI Meme Studio",
      features: [
        "1,000 meme generations (Image or Video)",
        "All basic video & image models",
        "Standard queue priority",
        "High quality downloads",
      ],
      tag: "Starter",
      popular: false,
    },
    {
      id: "creator",
      name: "Creator Pack",
      price: "$10.00",
      credits: 2000,
      description: "Perfect for casual creators and experimenters",
      features: [
        "2,000 meme generations (Image or Video)",
        "All premium video & image models",
        "Fast processing speed",
        "Uncapped generation lengths",
      ],
      tag: "Popular",
      popular: true,
    },
    {
      id: "pro",
      name: "Pro Pack",
      price: "$20.00",
      credits: 4000,
      description: "Best for active memers & community builders",
      features: [
        "4,000 meme generations (Image or Video)",
        "Priority queue access",
        "Access to early beta models",
        "Dedicated customer support",
      ],
      tag: "Best Value",
      popular: false,
    },
    {
      id: "business",
      name: "Business Pack",
      price: "$50.00",
      credits: 10000,
      description: "For marketing teams and design agencies",
      features: [
        "10,000 meme generations (Image or Video)",
        "Commercial usage rights",
        "API access endpoints",
        "Dedicated queue bandwidth",
      ],
      tag: "Business",
      popular: false,
    },
    {
      id: "enterprise",
      name: "Enterprise Pack",
      price: "$100.00",
      credits: 20000,
      description: "For large organizations and high volume memers",
      features: [
        "20,000 meme generations (Image or Video)",
        "Custom volume API keys",
        "SLA uptime agreement",
        "Assigned account representative",
      ],
      tag: "Scale",
      popular: false,
    },
  ];

  return (
    <main className="flex-1 overflow-y-auto bg-zinc-50 dark:bg-black px-6 py-16 min-h-screen">
      <div className="mx-auto max-w-4xl text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 dark:text-white sm:text-5xl">
          Get More Meme Credits
        </h1>
        <p className="mt-4 text-neutral-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
          Top up your account with credits to generate AI meme videos and images. Each generation costs exactly 1 credit.
        </p>
      </div>

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`flex flex-col justify-between p-6 rounded-2xl border transition-all ${plan.popular
              ? "bg-zinc-900 border-orange-500 text-white shadow-lg ring-1 ring-orange-500/20"
              : "bg-white dark:bg-zinc-900/50 border-zinc-200 dark:border-zinc-800 text-neutral-900 dark:text-white"
              }`}
          >
            <div>
              <div className="flex items-center justify-between gap-1">
                <h3 className="text-lg font-bold truncate">{plan.name}</h3>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0 ${plan.popular
                    ? "bg-orange-500 text-white"
                    : "bg-orange-500/10 text-orange-500"
                    }`}
                >
                  {plan.tag}
                </span>
              </div>
              <p className="mt-2 text-xs text-zinc-400 min-h-[32px]">{plan.description}</p>

              <div className="mt-6 flex items-baseline">
                <span className="text-3xl font-black tracking-tight">{plan.price}</span>
                <span className="ml-1 text-[10px] text-zinc-400">/ one-time</span>
              </div>

              <div className="mt-6 py-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">Credits Included</span>
                <span className="text-base font-bold text-orange-500">{plan.credits.toLocaleString()} cr</span>
              </div>

              <ul className="mt-6 space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-5">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-[11px] text-zinc-600 dark:text-zinc-300">
                    <FaCheck className="mt-0.5 text-orange-500 flex-shrink-0 text-[8px]" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => handleCheckout(plan.id)}
              disabled={loading !== null}
              className={`mt-8 w-full py-2.5 font-semibold text-xs rounded-xl transition-all active:scale-[0.98] ${plan.popular
                ? "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/25"
                : "bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading === plan.id ? "Redirecting..." : `Buy ${plan.name}`}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
