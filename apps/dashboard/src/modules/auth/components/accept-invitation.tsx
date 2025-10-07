import { getScopedI18n } from "@/locales/server";
import { auth } from "@/modules/auth/lib/auth";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { XCircle } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

interface AcceptInvitationProps {
  invitationId: string;
}

export async function AcceptInvitation({
  invitationId,
}: AcceptInvitationProps) {
  const t = await getScopedI18n("invitation.error");

  // Check if user is authenticated first
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    // User not authenticated - redirect to login with the invitation ID
    redirect(
      `/login?redirectTo=${encodeURIComponent(`/accept-invitation/${invitationId}`)}`,
    );
  }

  // User is authenticated, try to accept the invitation
  try {
    const result = await auth.api.acceptInvitation({
      headers: await headers(),
      body: {
        invitationId: invitationId,
      },
    });

    if (result) {
      // Success - redirect to dashboard which will handle routing logic
      redirect("/");
    }
  } catch (error) {
    // Check if this is a redirect error (expected behavior)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      // This is expected when redirect() is called, re-throw to allow the redirect
      throw error;
    }

    console.error("Error accepting invitation:", error);
    // Invitation failed to accept
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              {t("title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-muted-foreground">{t("message")}</p>
              <p className="text-sm text-muted-foreground">{t("contact")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
}
