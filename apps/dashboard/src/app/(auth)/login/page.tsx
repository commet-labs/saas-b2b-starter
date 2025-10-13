import { LoginForm } from "@/modules/auth/components/login-form";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="flex w-full flex-col p-8">
        <Suspense fallback={<div>Loading...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
