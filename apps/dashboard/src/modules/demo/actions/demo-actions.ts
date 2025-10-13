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
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { generateFakeEmail, generateOrgName } from "../lib/demo-utils";
import { generateSlugFromName } from "@/modules/organization/lib/slug-utils";

// Schema for creating demo organizations
async function createDemoOrganizationsSchema() {
  return z.object({
    count: z.coerce.number().min(1).max(100),
  });
}

// Schema for seat operations
async function seatOperationSchema() {
  return z.object({
    orgId: z.string().min(1),
    seatType: z.enum(["admin_seat", "editor_seat", "viewer_seat", "api_key"]),
    quantity: z.coerce.number().min(1).max(100),
  });
}

// Schema for usage events
async function usageEventSchema() {
  return z.object({
    orgId: z.string().min(1),
    eventType: z.enum([
      "api_call",
      "payment_transaction",
      "sms_notification",
      "analytics_usage",
      "data_processing",
      "user_activity",
    ]),
    quantity: z.coerce.number().min(1),
  });
}

// Schema for batch usage events
async function batchUsageEventSchema() {
  return z.object({
    orgId: z.string().min(1),
    eventType: z.enum([
      "api_call",
      "payment_transaction",
      "sms_notification",
      "analytics_usage",
      "data_processing",
      "user_activity",
    ]),
    count: z.coerce.number().min(1).max(1000),
  });
}

/**
 * Create multiple demo organizations
 */
export const createDemoOrganizations = withUser<ActionState>(
  createDemoOrganizationsSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof createDemoOrganizationsSchema>>
    >;

    try {
      const createdOrgs = [];

      for (let i = 0; i < validatedData.count; i++) {
        const orgName = generateOrgName();
        const baseSlug = generateSlugFromName(orgName);

        // Add random suffix to ensure uniqueness
        const slug = `${baseSlug}-${Math.random().toString(36).substr(2, 6)}`;

        try {
          // Create organization in DB using Better Auth
          const organization = await auth.api.createOrganization({
            headers: await headers(),
            body: {
              name: orgName,
              slug: slug,
            },
          });

          if (!organization) {
            console.error(`Failed to create organization: ${orgName}`);
            continue;
          }

          // Create customer in Commet
          try {
            await commet.customers.create({
              legalName: orgName,
              displayName: orgName,
              billingEmail: generateFakeEmail(orgName),
              externalId: organization.id,
            });

            console.log(
              `[Commet Demo] Customer created: ${orgName} (${organization.id})`,
            );
          } catch (commetError) {
            console.error(
              `Failed to create Commet customer for ${orgName}:`,
              commetError,
            );
          }

          createdOrgs.push({
            id: organization.id,
            name: orgName,
            slug,
          });
        } catch (error) {
          console.error(
            `Failed to create demo organization ${orgName}:`,
            error,
          );
        }
      }

      // Revalidate the demo page to show new organizations
      revalidatePath("/demo");

      return {
        success: true,
        message: `Created ${createdOrgs.length} organizations`,
      };
    } catch (error) {
      console.error("Failed to create demo organizations:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Add seats to an organization
 */
export const addSeatsToOrg = withUser<ActionState>(
  seatOperationSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof seatOperationSchema>>
    >;

    try {
      // Get organization details
      const [org] = await db
        .select()
        .from(organizationTable)
        .where(eq(organizationTable.id, validatedData.orgId))
        .limit(1);

      if (!org) {
        return {
          success: false,
          message: "Organization not found",
        };
      }

      // Add seats in Commet
      await commet.seats.add({
        externalId: validatedData.orgId,
        seatType: validatedData.seatType,
        count: validatedData.quantity,
      });

      console.log(
        `[Commet Demo] Added ${validatedData.quantity} ${validatedData.seatType} seats to ${org.name}`,
      );

      return {
        success: true,
        message: `Added ${validatedData.quantity} ${validatedData.seatType} seats`,
      };
    } catch (error) {
      console.error("Failed to add seats:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Remove seats from an organization
 */
export const removeSeatsFromOrg = withUser<ActionState>(
  seatOperationSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof seatOperationSchema>>
    >;

    try {
      // Get organization details
      const [org] = await db
        .select()
        .from(organizationTable)
        .where(eq(organizationTable.id, validatedData.orgId))
        .limit(1);

      if (!org) {
        return {
          success: false,
          message: "Organization not found",
        };
      }

      // Remove seats in Commet
      await commet.seats.remove({
        externalId: validatedData.orgId,
        seatType: validatedData.seatType,
        count: validatedData.quantity,
      });

      console.log(
        `[Commet Demo] Removed ${validatedData.quantity} ${validatedData.seatType} seats from ${org.name}`,
      );

      return {
        success: true,
        message: `Removed ${validatedData.quantity} ${validatedData.seatType} seats`,
      };
    } catch (error) {
      console.error("Failed to remove seats:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Send a single usage event
 */
export const sendUsageEvent = withUser<ActionState>(
  usageEventSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof usageEventSchema>>
    >;

    try {
      // Get organization details
      const [org] = await db
        .select()
        .from(organizationTable)
        .where(eq(organizationTable.id, validatedData.orgId))
        .limit(1);

      if (!org) {
        return {
          success: false,
          message: "Organization not found",
        };
      }

      // Send usage event to Commet
      await commet.usage.create({
        eventType: validatedData.eventType,
        externalId: validatedData.orgId,
        properties: [
          { property: "quantity", value: validatedData.quantity.toString() },
          { property: "demo", value: "true" },
          { property: "timestamp", value: new Date().toISOString() },
        ],
      });

      console.log(
        `[Commet Demo] Usage event: ${org.name} - ${validatedData.quantity}x ${validatedData.eventType}`,
      );

      return {
        success: true,
        message: `Tracked ${validatedData.quantity}x ${validatedData.eventType}`,
      };
    } catch (error) {
      console.error("Failed to send usage event:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);

/**
 * Send multiple usage events in batch
 */
export const sendBatchUsageEvents = withUser<ActionState>(
  batchUsageEventSchema,
  async (data, formData, user): Promise<ActionState> => {
    const validatedData = data as z.infer<
      Awaited<ReturnType<typeof batchUsageEventSchema>>
    >;

    try {
      // Get organization details
      const [org] = await db
        .select()
        .from(organizationTable)
        .where(eq(organizationTable.id, validatedData.orgId))
        .limit(1);

      if (!org) {
        return {
          success: false,
          message: "Organization not found",
        };
      }

      // Create batch events
      const events = Array.from({ length: validatedData.count }, (_, i) => ({
        eventType: validatedData.eventType,
        externalId: validatedData.orgId,
        timestamp: new Date(Date.now() + i * 1000).toISOString(),
        properties: [
          { property: "quantity", value: "1" },
          { property: "demo", value: "true" },
          { property: "batch_index", value: i.toString() },
        ],
      }));

      // Send batch to Commet
      await commet.usage.createBatch({ events });

      console.log(
        `[Commet Demo] Batch usage: ${org.name} - ${validatedData.count}x ${validatedData.eventType}`,
      );

      return {
        success: true,
        message: `Tracked ${validatedData.count} events in batch`,
      };
    } catch (error) {
      console.error("Failed to send batch usage events:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);
