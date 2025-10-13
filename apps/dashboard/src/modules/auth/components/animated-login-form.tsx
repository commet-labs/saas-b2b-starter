"use client";

import { authClient } from "@/modules/auth/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { AnimatePresence, motion } from "motion/react";
import { Check, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface AnimatedLoginFormProps {
  onError: (error: string | null) => void;
}

export const AnimatedLoginForm = ({ onError }: AnimatedLoginFormProps) => {
  const [email, setEmail] = useState("");
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  // Countdown timer
  useEffect(() => {
    if (magicLinkSent && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    if (countdown === 0) {
      setCanResend(true);
    }
  }, [magicLinkSent, countdown]);

  // Reset countdown when magic link is sent
  useEffect(() => {
    if (magicLinkSent) {
      setCountdown(30);
      setCanResend(false);
    }
  }, [magicLinkSent]);

  // Email validation function
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Validate email format before sending to server
    if (!isValidEmail(email)) {
      const errorMessage = "Please enter a valid email address";
      setError(errorMessage);
      onError(errorMessage);
      return;
    }

    setError(null);
    onError(null);
    setIsMagicLinkLoading(true);

    try {
      await authClient.signIn.magicLink({
        email,
        callbackURL: redirectTo,
      });
      setMagicLinkSent(true);
    } catch (error) {
      const errorMessage = "Error sending magic link";
      setError(errorMessage);
      onError(errorMessage);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  // Remove credentials submit since Better Auth uses magic link only

  const handleSendAnother = () => {
    setMagicLinkSent(false);
    setError(null);
    onError(null);
    setCountdown(30);
    setCanResend(false);
  };

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        {magicLinkSent ? (
          /* Magic Link Sent Confirmation */
          <motion.div
            key="magic-link-sent"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{
              duration: 0.4,
              ease: [0.23, 1, 0.32, 1], // Custom easing for smoother feel
            }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.3 }}
              className="text-center space-y-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.2,
                  duration: 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
                className="p-4 rounded-lg bg-green-50 border border-green-200 shadow-sm"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    delay: 0.3,
                    duration: 0.3,
                    type: "spring",
                    stiffness: 300,
                  }}
                  className="mb-2"
                >
                  <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="w-6 h-6 text-green-600" />
                  </div>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.3 }}
                  className="text-sm text-green-800 font-medium"
                >
                  Magic link sent!
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.3 }}
                  className="text-xs text-green-600 mt-1"
                >
                  Check your email and click the link to sign in
                </motion.p>
              </motion.div>

              {/* Resend Button with Countdown */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.3 }}
                className="w-full"
              >
                <Button
                  variant="outline"
                  className="w-full relative overflow-hidden"
                  onClick={handleSendAnother}
                  disabled={!canResend || isMagicLinkLoading}
                >
                  {/* Progress bar background */}
                  {!canResend && (
                    <motion.div
                      className="absolute inset-0 bg-gray-100"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 30, ease: "linear" }}
                    />
                  )}

                  {/* Button content */}
                  <span className="relative z-10 flex items-center justify-center">
                    {canResend ? (
                      "Send another link"
                    ) : (
                      <span className="flex items-center space-x-2">
                        <span>Send another link</span>
                        <motion.span
                          key={countdown}
                          initial={{ scale: 1.2, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.2 }}
                          className="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-mono"
                        >
                          {countdown}s
                        </motion.span>
                      </span>
                    )}
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          /* Login Form */
          <motion.div
            key="login-form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-4"
          >
            {/* Magic Link Form - Includes email input and submit button */}
            <form onSubmit={handleMagicLinkSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="animated-email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="animated-email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isMagicLinkLoading}
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!email || isMagicLinkLoading}
              >
                {isMagicLinkLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Magic Link"
                )}
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
