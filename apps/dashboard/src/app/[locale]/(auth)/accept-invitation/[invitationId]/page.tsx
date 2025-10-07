import { AcceptInvitation } from "@/modules/auth/components/accept-invitation";

interface AcceptInvitationPageProps {
  params: Promise<{ invitationId: string }>;
}

export default async function AcceptInvitationPage({
  params,
}: AcceptInvitationPageProps) {
  const { invitationId } = await params;

  return <AcceptInvitation invitationId={invitationId} />;
}
