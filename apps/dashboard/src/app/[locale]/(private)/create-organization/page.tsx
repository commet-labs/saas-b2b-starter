import { auth } from "@/modules/auth/lib/auth";
import { CreateOrganizationForm } from "@/modules/settings/organization/components/create-organization-form";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function CreateOrganizationPage() {
  // Check if user is authenticated
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  // Check if user already has organizations
  const organizations = await auth.api.listOrganizations({
    headers: await headers(),
  });

  // If user already has organizations, redirect to dashboard
  if (organizations.length > 0) {
    redirect("/");
  }

  return <CreateOrganizationForm />;
}
