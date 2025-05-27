"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { subscribeToNewsletter } from "../app/actions/newsletter";

export function EmailSignUpForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await subscribeToNewsletter(email);
      setStatus("success");
      setEmail("");
    } catch (error) {
      setStatus("error");
      setErrorMessage("Failed to subscribe. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-semibold text-neutral-900 dark:text-neutral-100"
          >
            Get the latest updates and news delivered to your inbox
          </label>
          <p className="text-sm pb-4  text-neutral-500 dark:text-neutral-400">
            Top 3 OGHUNT launches of the day sent daily to your inbox
          </p>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-neutral-200 dark:border-neutral-700 focus:border-primary focus:ring-2 focus:ring-primary/20 dark:focus:ring-primary/30 transition-all duration-200 outline-none text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 dark:bg-neutral-700"
              placeholder="Enter your email"
            />
          </div>
        </div>
        <Button type="submit" fullWidth disabled={status === "loading"}>
          {status === "loading" ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Subscribing...</span>
            </div>
          ) : (
            "Subscribe to Daily Emails"
          )}
        </Button>
        {status === "success" && (
          <p className="text-sm text-green-600 dark:text-green-400 font-medium text-center">
            Thanks for subscribing! We'll keep you updated.
          </p>
        )}
        {status === "error" && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
            {errorMessage}
          </p>
        )}
      </form>
    </div>
  );
}
