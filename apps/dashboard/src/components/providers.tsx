"use client";

import { I18nProviderClient } from "@/locales/client";
import { KeyboardShortcutProvider } from "@repo/ui/hooks/use-keyboard-shortcut";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import type { ReactNode } from "react";
import { DesktopProvider } from "./desktop-provider";

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
        <KeyboardShortcutProvider>
          <DesktopProvider />
          <NuqsAdapter>{children}</NuqsAdapter>
        </KeyboardShortcutProvider>
      </NextThemesProvider>
    </I18nProviderClient>
  );
}
