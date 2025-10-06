import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@repo/database";
import { magicLink } from "better-auth/plugins";
import { env } from "node:process";

const baseURL: string | undefined =
  env.VERCEL === "1"
    ? env.VERCEL_ENV === "production"
      ? env.BETTER_AUTH_URL
      : env.VERCEL_ENV === "preview"
        ? `https://${env.VERCEL_BRANCH_URL}`
        : undefined
    : undefined;

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
    }),
    baseURL: baseURL,

    emailAndPassword: { 
        enabled: true, 
      },
      plugins: [
        magicLink({
            async sendMagicLink(data) {
              try {
                console.log("Sending magic link to", data.email);
                // await emailService.send({
                //   from: "Commet <decker@commet.co>",
                //   to: data.email,
                //   subject: "Sign in to Commet",
                //   react: MagicLinkEmail({
                //     magicLink: data.url,
                //     email: data.email,
                //   }),
                //   metadata: {
                //     magicLink: data.url,
                //   },
                // });
              } catch (error) {
                console.error("Failed to send magic link email:", error);
                throw error;
              }
            },
          }),    ]
});