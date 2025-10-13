import { auth } from "@/modules/auth/lib/auth";
import { db } from "@repo/database/connection";
import {
  member,
  organization as organizationTable,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export interface DemoOrganization {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export const getDemoOrganizations = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return {
      organizations: [],
      activeOrganization: null,
    };
  }

  const user = session.user;

  // Get all organizations where user is a member
  const orgs = await db
    .select({
      id: organizationTable.id,
      name: organizationTable.name,
      slug: organizationTable.slug,
      createdAt: organizationTable.createdAt,
    })
    .from(organizationTable)
    .innerJoin(member, eq(member.organizationId, organizationTable.id))
    .where(eq(member.userId, user.id))
    .orderBy(organizationTable.createdAt);

  // Get active organization from session
  const activeOrgId = session.session.activeOrganizationId;
  const activeOrg = activeOrgId
    ? orgs.find((org) => org.id === activeOrgId) || null
    : null;

  return {
    organizations: orgs,
    activeOrganization: activeOrg,
  };
};
