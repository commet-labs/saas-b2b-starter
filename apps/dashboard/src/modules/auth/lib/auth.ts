import { env } from "@/env";
import { db } from "@repo/database/connection";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { magicLink, organization } from "better-auth/plugins";

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
    enabled: false,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    magicLink({
      async sendMagicLink(data) {
        console.log("Sending magic link email:", data);
      },
    }),
    organization({
      async sendInvitationEmail(data) {
        try {
          const inviteLink = `${env.BETTER_AUTH_URL}/accept-invitation/${data.id}`;
          console.log("Sending invitation email:", inviteLink);
        } catch (error) {
          console.error("Failed to send invitation email:", error);
          throw error;
        }
      },
      organizationCreation: {
        afterCreate: async ({ organization, user }) => {
          try {
            console.log(
              `Organization ${organization.name} created for user ${user.email}`,
            );
          } catch (error) {
            console.error("Failed to process organization creation:", error);
          }
        },
      },
    }),
  ],
});
