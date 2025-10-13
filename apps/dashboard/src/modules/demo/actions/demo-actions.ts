"use server";

import { auth } from "@/modules/auth/lib/auth";
import { commet } from "@/modules/shared/lib/commet-client";
import { db } from "@repo/database/connection";
import {
  member,
  organization as organizationTable,
} from "@repo/database/schema";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { generateFakeEmail, generateOrgName } from "../lib/demo-utils";
import { generateSlugFromName } from "@/modules/organization/lib/slug-utils";

interface ActionResult {
  success: boolean;
  message?: string;
  data?: unknown;
  error?: string;
}

/**
 * Create multiple demo organizations
 */
export async function createDemoOrganizations(
  count: number,
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    const user = session.user;
    const createdOrgs = [];

    for (let i = 0; i < count; i++) {
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
        console.error(`Failed to create demo organization ${orgName}:`, error);
      }
    }

    return {
      success: true,
      message: `Created ${createdOrgs.length} organizations`,
      data: createdOrgs,
    };
  } catch (error) {
    console.error("Failed to create demo organizations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Add seats to an organization
 */
export async function addSeatsToOrg(
  orgId: string,
  seatType: "admin_seat" | "editor_seat" | "viewer_seat" | "api_key",
  quantity: number,
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Get organization details
    const [org] = await db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, orgId))
      .limit(1);

    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    // Add seats in Commet
    const result = await commet.seats.add({
      externalId: orgId,
      seatType: seatType,
      count: quantity,
    });

    console.log(
      `[Commet Demo] Added ${quantity} ${seatType} seats to ${org.name}`,
    );

    return {
      success: true,
      message: `Added ${quantity} ${seatType} seats`,
      data: result,
    };
  } catch (error) {
    console.error("Failed to add seats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Remove seats from an organization
 */
export async function removeSeatsFromOrg(
  orgId: string,
  seatType: "admin_seat" | "editor_seat" | "viewer_seat" | "api_key",
  quantity: number,
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Get organization details
    const [org] = await db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, orgId))
      .limit(1);

    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    // Remove seats in Commet
    const result = await commet.seats.remove({
      externalId: orgId,
      seatType: seatType,
      count: quantity,
    });

    console.log(
      `[Commet Demo] Removed ${quantity} ${seatType} seats from ${org.name}`,
    );

    return {
      success: true,
      message: `Removed ${quantity} ${seatType} seats`,
      data: result,
    };
  } catch (error) {
    console.error("Failed to remove seats:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send a single usage event
 */
export async function sendUsageEvent(
  orgId: string,
  eventType:
    | "api_call"
    | "payment_transaction"
    | "sms_notification"
    | "analytics_usage"
    | "data_processing"
    | "user_activity",
  quantity: number,
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Get organization details
    const [org] = await db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, orgId))
      .limit(1);

    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    // Send usage event to Commet
    const result = await commet.usage.create({
      eventType: eventType,
      externalId: orgId,
      properties: [
        { property: "quantity", value: quantity.toString() },
        { property: "demo", value: "true" },
        { property: "timestamp", value: new Date().toISOString() },
      ],
    });

    console.log(
      `[Commet Demo] Usage event: ${org.name} - ${quantity}x ${eventType}`,
    );

    return {
      success: true,
      message: `Tracked ${quantity}x ${eventType}`,
      data: result,
    };
  } catch (error) {
    console.error("Failed to send usage event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send multiple usage events in batch
 */
export async function sendBatchUsageEvents(
  orgId: string,
  eventType:
    | "api_call"
    | "payment_transaction"
    | "sms_notification"
    | "analytics_usage"
    | "data_processing"
    | "user_activity",
  count: number,
): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Get organization details
    const [org] = await db
      .select()
      .from(organizationTable)
      .where(eq(organizationTable.id, orgId))
      .limit(1);

    if (!org) {
      return { success: false, error: "Organization not found" };
    }

    // Create batch events
    const events = Array.from({ length: count }, (_, i) => ({
      eventType: eventType,
      externalId: orgId,
      timestamp: new Date(Date.now() + i * 1000).toISOString(),
      properties: [
        { property: "quantity", value: "1" },
        { property: "demo", value: "true" },
        { property: "batch_index", value: i.toString() },
      ],
    }));

    // Send batch to Commet
    const result = await commet.usage.createBatch({ events });

    console.log(
      `[Commet Demo] Batch usage: ${org.name} - ${count}x ${eventType}`,
    );

    return {
      success: true,
      message: `Tracked ${count} events in batch`,
      data: result,
    };
  } catch (error) {
    console.error("Failed to send batch usage events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Get all organizations for current user
 */
export async function getDemoOrganizations(): Promise<ActionResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
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

    return {
      success: true,
      data: orgs,
    };
  } catch (error) {
    console.error("Failed to get demo organizations:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
