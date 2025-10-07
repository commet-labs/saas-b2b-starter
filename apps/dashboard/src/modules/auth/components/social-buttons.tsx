"use client";

import { useScopedI18n } from "@/locales/client";
import { authClient } from "@/modules/auth/lib/auth-client";
import { Button } from "@repo/ui/components/button";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

interface SocialButtonsProps {
  isAnyLoading: boolean;
  onError: (error: string | null) => void;
  onGoogleLoadingChange: (loading: boolean) => void;
  onMicrosoftLoadingChange: (loading: boolean) => void;
  isPasswordMode: boolean;
  onPasswordModeToggle: () => void;
}

export function SocialButtons({
  isAnyLoading,
  onError,
  onGoogleLoadingChange,
  onMicrosoftLoadingChange,
  isPasswordMode,
  onPasswordModeToggle,
}: SocialButtonsProps) {
  const t = useScopedI18n("login");
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState(false);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      onGoogleLoadingChange(true);
      onError(null);

      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectTo,
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      onError(t("googleError"));
    } finally {
      setIsGoogleLoading(false);
      onGoogleLoadingChange(false);
    }
  };

  const handleMicrosoftSignIn = async () => {
    try {
      setIsMicrosoftLoading(true);
      onMicrosoftLoadingChange(true);
      onError(null);

      // Note: Microsoft provider would need to be configured in Better Auth
      // For now, we'll show an error
      throw new Error("Microsoft sign-in not configured");
    } catch (error) {
      console.error("Microsoft sign in error:", error);
      onError("Microsoft sign-in not available yet");
    } finally {
      setIsMicrosoftLoading(false);
      onMicrosoftLoadingChange(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Google Button */}
      <Button
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        disabled={isAnyLoading}
      >
        {isGoogleLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("googleButtonLoading")}
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                fill="currentColor"
              />
            </svg>
            {t("googleButton")}
          </>
        )}
      </Button>

      {/* Microsoft Button - Optional, commented out for now */}
      {/* 
      <Button
        variant="outline"
        className="w-full"
        onClick={handleMicrosoftSignIn}
        disabled={isAnyLoading}
      >
        {isMicrosoftLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in with Microsoft...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="w-4 h-4 mr-2"
            >
              <path
                d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                fill="currentColor"
              />
            </svg>
            Continue with Microsoft
          </>
        )}
      </Button>
      */}

      {/* Password Mode Toggle - Commented out since Better Auth doesn't use passwords */}
      {/* 
      <Button
        variant="ghost"
        className="w-full text-sm"
        onClick={onPasswordModeToggle}
        disabled={isAnyLoading}
      >
        {isPasswordMode ? "Use magic link instead" : "Use password instead"}
      </Button>
      */}
    </div>
  );
}
