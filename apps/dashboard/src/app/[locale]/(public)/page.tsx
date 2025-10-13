import { auth } from "@/modules/auth/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // If user is authenticated, redirect based on organization status
  if (session) {
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
        redirect("/demo");
      }
    }

    // If no active organization, check if user has any organizations
    const organizations = await auth.api.listOrganizations({
      headers: await headers(),
    });

    // If user has organizations but no active one, set the first as active and redirect
    if (organizations.length > 0) {
      const firstOrg = organizations[0];
      if (firstOrg?.id) {
        await auth.api.setActiveOrganization({
          headers: await headers(),
          body: {
            organizationId: firstOrg.id,
          },
        });
        redirect("/demo");
      }
    }

    // If user has no organizations, redirect to create one
    redirect("/create-organization");
  }

  // User is not authenticated, show landing page
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Bienvenido a Commet Billing</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        La plataforma para gestionar tu facturación
      </p>
      {/* Aquí puedes agregar tu landing page */}
    </div>
  );
}
