"use server";

import { auth } from "@/modules/auth/lib/auth";
import {
  type ActionState,
  withUser,
} from "@/modules/shared/lib/middleware-action";
import { commet } from "@/modules/shared/lib/commet-client";
import { db } from "@repo/database/connection";
import { organization as organizationTable } from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { generateSlugFromName } from "../lib/slug-utils";

// Schema for creating organization
const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, "Organization name is required")
    .max(50, "Organization name must be less than 50 characters")
    .trim(),
  slug: z
    .string()
    .max(48, "Organization slug must be less than 48 characters")
    .regex(
      /^[a-z0-9-]*$/,
      "Only lowercase letters, numbers and hyphens are allowed",
    )
    .trim()
    .optional(), // Make slug optional since it can be auto-generated
});

export const createOrganization = withUser<ActionState>(
  async () => createOrganizationSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<typeof createOrganizationSchema>;

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
          message: "Failed to create organization",
        };
      }

      // Set as active organization
      await auth.api.setActiveOrganization({
        headers: await headers(),
        body: {
          organizationId: organization.id,
        },
      });

      // Create customer in Commet
      try {
        await commet.customers.create({
          legalName: organization.name,
          displayName: organization.name,
          billingEmail: user.email,
          externalId: organization.id,
        });
        console.log(
          `[Commet] Customer created: ${organization.name} (${organization.id})`,
        );
      } catch (commetError) {
        // Log the error but don't fail the organization creation
        console.error("Failed to create Commet customer:", commetError);
        // The organization was created successfully, so we continue
      }

      // Redirect to the organization dashboard (this will throw NEXT_REDIRECT)
      redirect("/dashboard");
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
            message:
              "This slug is already taken. Please choose a different one.",
            errors: {
              slug: [
                "This slug is already taken. Please choose a different one.",
              ],
            },
          };
        }
      }

      // Generic error
      return {
        success: false,
        message: "Failed to create organization",
      };
    }
  },
);
