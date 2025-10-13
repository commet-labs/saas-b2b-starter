"use client";

import { useState } from "react";
import { AnimatedLoginForm } from "./animated-login-form";
import { LoginHeader } from "./login-header";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  return (
    <div className="flex flex-col justify-center space-y-6 my-auto w-full max-w-sm mx-auto">
      <LoginHeader />

      <AnimatedLoginForm onError={handleError} />
      {error && (
        <div className="text-sm text-center p-3 rounded-md text-red-600 bg-red-50 border border-red-200">
          {error}
        </div>
      )}
    </div>
  );
}
