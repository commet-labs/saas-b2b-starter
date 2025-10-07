export const authLocales = {
  login: {
    title: "Welcome back",
    description: "Login with your Google account or use magic link",
    googleButton: "Login with Google",
    googleButtonLoading: "Signing in...",
    orContinue: "Or continue with",
    emailLabel: "Email",
    emailPlaceholder: "m@example.com",
    emailError: "Please enter a valid email address",
    sendMagicLink: "Send Magic Link",
    sendingMagicLink: "Sending...",
    magicLinkSent: "Check your email for a magic link!",
    magicLinkSentTitle: "Magic link sent!",
    magicLinkSentDescription: "Check your email and click the link to sign in",
    sendAnotherLink: "Send another link",
    googleError: "Error signing in with Google",
    magicLinkError: "Error sending magic link",
    termsText: "By clicking continue, you agree to our",
    termsLink: "Terms of Service",
    privacyLink: "Privacy Policy",
  },
  invitation: {
    error: {
      title: "Error Accepting Invitation",
      message:
        "The invitation could not be accepted. It may have expired or already been used.",
      contact:
        "If you think this is an error, contact the person who sent you the invitation.",
    },
  },
} as const;
