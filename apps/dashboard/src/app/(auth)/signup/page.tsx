"use client";

import { SignupForm } from "@/modules/auth/components/signup-form";
import Link from "next/link";
import { Suspense, useState } from "react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);

  const handleError = (errorMessage: string | null) => {
    setError(errorMessage);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col p-8">
        <div className="flex flex-col justify-center space-y-6 my-auto w-full max-w-sm mx-auto">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight">
              Crear cuenta
            </h1>
            <p className="text-sm text-muted-foreground">
              Ingresa tus datos para registrarte
            </p>
          </div>

          {/* Signup Form */}
          <Suspense fallback={<div>Cargando...</div>}>
            <SignupForm onError={handleError} />
          </Suspense>

          {/* Error Message */}
          {error && (
            <div className="text-sm text-center p-3 rounded-md text-red-600 bg-red-50 border border-red-200">
              {error}
            </div>
          )}

          {/* Link to Login */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
            <Link
              href="/login"
              className="font-medium text-primary hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
