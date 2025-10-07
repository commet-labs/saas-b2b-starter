import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function PrivatePage() {
  // This page will always redirect, but we show a loading state just in case
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Check if user has an active organization from session
  if (session.session.activeOrganizationId) {
    // Get user's organizations to find the active one
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    const activeOrganization = organizations.find(
      (org) => org.id === session.session.activeOrganizationId,
    );

    if (activeOrganization) {
      redirect(`/${activeOrganization.slug}/agreements`);
    }
  }

  // If no active organization, check if user has any organizations
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // If user has organizations but no active one, set the first as active and redirect
  if (organizations.length > 0) {
    const firstOrg = organizations[0];
    if (firstOrg?.id && firstOrg?.slug) {
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: firstOrg.id,
        },
      });
      redirect(`/${firstOrg.slug}/agreements`);
    }
  }

  // If user has no organizations, redirect to create one
  redirect("/create-organization");
}
