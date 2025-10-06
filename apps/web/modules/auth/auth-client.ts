import {
  apiKeyClient,
  magicLinkClient,
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";


export const authClient = createAuthClient({
  plugins: [
    magicLinkClient(),

    apiKeyClient(),
  ],
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
});

export const { signIn, signOut, signUp, useSession } = authClient;
