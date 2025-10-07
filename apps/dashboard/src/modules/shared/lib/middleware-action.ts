import { getScopedI18n } from "@/locales/server";
import { auth } from "@/modules/auth/lib/auth";
import { db } from "@repo/database/connection";
import type { Organization, User } from "@repo/database/schema";
import { organization as organizationTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import type { z } from "zod";
import { getUser } from "./get-user";
export type ActionState = {
  success: boolean;
  message: string;
  errors?: {
    [key: string]: string[];
  };
};

type WithUserFunction<T> = (
  data: unknown,
  formData: FormData,
  user: User,
) => Promise<T>;

export function withUser<T>(
  createSchema: () => Promise<z.ZodType<unknown, unknown>>,
  actionName: string,
  action: WithUserFunction<T>,
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const t = await getScopedI18n("shared.validation");

    const user = await getUser();
    if (!user) {
      throw new Error("User is not authenticated");
    }

    // Create schema with translations
    const schema = await createSchema();
    const result = schema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return {
        success: false,
        message: t("validation_failed"),
        errors: result.error.flatten().fieldErrors,
      } as T;
    }

    return action(result.data, formData, user);
  };
}

// New middleware that includes active organization from Better Auth
type WithUserAndOrgFunction<T> = (
  data: unknown,
  formData: FormData,
  user: User,
  organization: Organization,
) => Promise<T>;

export function withUserAndOrg<T>(
  createSchema: () => Promise<z.ZodType<unknown, unknown>>,
  actionName: string,
  action: WithUserAndOrgFunction<T>,
) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const t = await getScopedI18n("shared.validation");

    // Get session with organization from Better Auth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("User is not authenticated");
    }

    // Get active organization from session
    if (!session.session.activeOrganizationId) {
      throw new Error("No active organization found in session");
    }

    // Get organization details from database
    const activeOrganization = await db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, session.session.activeOrganizationId))
      .limit(1)
      .then((orgs) => orgs[0]);

    if (!activeOrganization) {
      throw new Error("Active organization not found");
    }

    // Create schema with translations
    const schema = await createSchema();
    const result = schema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
      return {
        success: false,
        message: t("validation_failed"),
        errors: result.error.flatten().fieldErrors,
      } as T;
    }

    return action(
      result.data,
      formData,
      session.user as User,
      activeOrganization,
    );
  };
}
