"use client";
import { createI18nClient } from "next-international/client";

export const languages = ["es", "en", "pt"];

export const {
  useScopedI18n,
  I18nProviderClient,
  useCurrentLocale,
  useChangeLocale,
  useI18n,
} = createI18nClient({
  en: () => import("./en"),
  es: () => import("./es"),
  pt: () => import("./pt"),
});
