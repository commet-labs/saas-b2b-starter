import { LoginForm } from "@/modules/auth/components/login-form";
import { CommetLogo } from "@repo/ui/components/commet-logo";
import { WritingText } from "@repo/ui/components/writing";

export default async function LoginPage() {
  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-between bg-white p-12 dark:bg-black lg:flex">
        <div className="flex items-center space-x-2">
          <CommetLogo className="text-black dark:text-white" />
          <span className="text-xl font-semibold">Commet</span>
        </div>
        <div className="flex flex-col items-right">
          <WritingText
            className="text-2xl font-medium mb-4"
            text="Con Commet, conseguimos disminuir el tiempo de cálculo y
            liquidación de comisiones en un 90%. Adicionalmente, el equipo se
            muestra más motivado al entender de manera clara sus incentivos"
            transition={{
              type: "spring",
              bounce: 0,
              duration: 1,
              delay: 0.2,
            }}
          />
          <cite className="text-lg">Felipe Hanna</cite>
          <div className="text-sm"> Head of Sales - Fintoc</div>
        </div>
      </div>
      <div className="flex w-full flex-col p-8 lg:w-1/2">
        <LoginForm />
      </div>
    </div>
  );
}
