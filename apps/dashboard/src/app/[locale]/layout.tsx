import { Analytics } from "@vercel/analytics/next";
import { IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";

import "@repo/ui/globals.css";
import { Toaster } from "@repo/ui/components/sonner";
import type { Metadata } from "next";
import { Providers } from "@/modules/shared/components/providers";

const fontSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-sans",
});

const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Commet Billing",
  description:
    "Commet Billing is a platform for managing your billing and invoices.",
};

export default async function Layout(props: LayoutProps<"/[locale]">) {
  const params = await props.params;

  const { locale } = params;

  const { children } = props;

  return (
    <html suppressHydrationWarning lang={locale}>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased `}
      >
        <Providers locale={locale}>{children}</Providers>
        <Analytics />
        <Toaster richColors />
      </body>
    </html>
  );
}
