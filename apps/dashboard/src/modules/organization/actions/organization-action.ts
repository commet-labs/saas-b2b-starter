"use server";

import { getScopedI18n } from "@/locales/server";
import { auth } from "@/modules/auth/lib/auth";
import {
  type ActionState,
  withUser,
  withUserAndOrg,
} from "@/modules/shared/lib/middleware-action";
import { db } from "@repo/database/connection";
import {
  member,
  organization as organizationTable,
} from "@repo/database/schema";
import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSlugFromName } from "../lib/slug-utils";

// Dynamic schema for creating organization
async function createOrganizationSchema() {
  const t = await getScopedI18n("organization.create.validation");
  return z.object({
    name: z
      .string()
      .min(1, t("name.required"))
      .max(50, t("name.maxLength"))
      .trim(),
    slug: z
      .string()
      .max(48, t("slug.maxLength"))
      .regex(/^[a-z0-9-]*$/, t("slug.format"))
      .trim()
      .optional(), // Make slug optional since it can be auto-generated
  });
}

export const createOrganization = withUser<ActionState>(
  createOrganizationSchema,
  async (data, formData, user): Promise<ActionState> => {
    const t = await getScopedI18n("organization.create");
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof createOrganizationSchema>>
    >;

    try {
      // Generate slug if not provided or empty
      let finalSlug = validatedData.slug;
      if (!finalSlug) {
        const baseSlug = generateSlugFromName(validatedData.name);

        // Check if base slug is available
        const [existingOrg] = await db
          .select({ id: organizationTable.id })
          .from(organizationTable)
          .where(eq(organizationTable.slug, baseSlug))
          .limit(1);

        if (existingOrg) {
          // If not available, add random suffix
          finalSlug = `${baseSlug}-${Math.random().toString(36).substr(2, 4)}`;
        } else {
          finalSlug = baseSlug;
        }
      }

      // Create the organization using Better Auth
      const organization = await auth.api.createOrganization({
        headers: await headers(),
        body: {
          name: validatedData.name,
          slug: finalSlug,
        },
      });

      if (!organization) {
        return {
          success: false,
          message: t("messages.error"),
        };
      }

      // Set as active organization
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: organization.id,
        },
      });

      // Redirect to the organization dashboard (this will throw NEXT_REDIRECT)
      redirect(`/${finalSlug}/dashboard`);
    } catch (error) {
      // Check if this is a redirect error (expected behavior)
      if (error instanceof Error && error.message === "NEXT_REDIRECT") {
        // This is expected when organization is created successfully, re-throw to allow the redirect
        throw error;
      }

      console.error("Failed to create organization:", error);

      // Check if the error is related to slug uniqueness (Better Auth handles this)
      if (error instanceof Error) {
        // Better Auth typically throws errors with specific messages for constraint violations
        const errorMessage = error.message.toLowerCase();
        if (
          errorMessage.includes("unique") ||
          errorMessage.includes("duplicate") ||
          errorMessage.includes("already exists")
        ) {
          return {
            success: false,
            message: t("messages.slugTaken"),
            errors: { slug: [t("messages.slugTaken")] },
          };
        }
      }

      // Generic error
      return {
        success: false,
        message: t("messages.error"),
      };
    }
  },
);
