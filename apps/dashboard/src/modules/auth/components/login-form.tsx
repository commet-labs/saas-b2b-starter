"use client";

import { useScopedI18n } from "@/locales/client";
import { useState } from "react";
import { AnimatedLoginForm } from "./animated-login-form";
import { LoginHeader } from "./login-header";
import { SocialButtons } from "./social-buttons";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [isMicrosoftLoading, setIsMicrosoftLoading] = useState<boolean>(false);
  const [isPasswordMode, setIsPasswordMode] = useState<boolean>(false);
  const t = useScopedI18n("login");

  const isAnyLoading = isGoogleLoading || isMicrosoftLoading;

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  const handleGoogleLoadingChange = (loading: boolean) => {
    setIsGoogleLoading(loading);
  };

  const handleMicrosoftLoadingChange = (loading: boolean) => {
    setIsMicrosoftLoading(loading);
  };

  const handlePasswordModeToggle = () => {
    setIsPasswordMode(!isPasswordMode);
    setError(null);
  };

  return (
    <div className="flex flex-col justify-center space-y-6 my-auto w-full max-w-sm mx-auto">
      <LoginHeader />

      <AnimatedLoginForm
        onError={handleError}
        isAnyLoading={isAnyLoading}
        isPasswordMode={isPasswordMode}
      />

      {error && (
        <div className="text-sm text-center p-3 rounded-md text-red-600 bg-red-50 border border-red-200">
          {error}
        </div>
      )}

      <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
        <span className="bg-background text-muted-foreground relative z-10 px-2">
          {t("orContinue")}
        </span>
      </div>

      <SocialButtons
        isAnyLoading={isAnyLoading}
        onError={handleError}
        onGoogleLoadingChange={handleGoogleLoadingChange}
        onMicrosoftLoadingChange={handleMicrosoftLoadingChange}
        isPasswordMode={isPasswordMode}
        onPasswordModeToggle={handlePasswordModeToggle}
      />

      <div className="text-muted-foreground text-center text-xs text-balance">
        {t("termsText")}{" "}
        <a href="/" className="underline underline-offset-4 hover:text-primary">
          {t("termsLink")}
        </a>{" "}
        and{" "}
        <a href="/" className="underline underline-offset-4 hover:text-primary">
          {t("privacyLink")}
        </a>
        .
      </div>
    </div>
  );
}
