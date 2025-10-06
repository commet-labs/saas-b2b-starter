"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { I18nProviderClient } from "@/locales/client";

type ProviderProps = {
  locale: string;
  children: ReactNode;
};

export function Providers({ locale, children }: ProviderProps) {
  return (
    <I18nProviderClient locale={locale}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <NuqsAdapter>{children}</NuqsAdapter>
      </NextThemesProvider>
    </I18nProviderClient>
  );
}
