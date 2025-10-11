/**
 * Utility functions for demo page
 */

const COMPANY_PREFIXES = [
  "Acme",
  "Tech",
  "Global",
  "Prime",
  "Nova",
  "Apex",
  "Elite",
  "Digital",
  "Smart",
  "Quantum",
];

const COMPANY_SUFFIXES = [
  "Corp",
  "Inc",
  "Solutions",
  "Systems",
  "Labs",
  "Technologies",
  "Ventures",
  "Group",
  "Dynamics",
  "Industries",
];

/**
 * Generate a fake organization name
 */
export function generateOrgName(): string {
  const prefix =
    COMPANY_PREFIXES[Math.floor(Math.random() * COMPANY_PREFIXES.length)];
  const suffix =
    COMPANY_SUFFIXES[Math.floor(Math.random() * COMPANY_SUFFIXES.length)];
  const number = Math.floor(Math.random() * 9999);
  return `${prefix} ${suffix} ${number}`;
}

/**
 * Generate a fake email for billing
 */
export function generateFakeEmail(orgName: string): string {
  const slug = orgName
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return `billing-${slug}@demo.commet.co`;
}

/**
 * Event types for the demo
 */
export type DemoEventType = "customer" | "seat" | "usage";

export type DemoEventAction =
  | "customer_created"
  | "seats_added"
  | "seats_removed"
  | "usage_tracked"
  | "batch_usage_tracked";

export interface DemoEvent {
  id: string;
  type: DemoEventType;
  action: DemoEventAction;
  timestamp: string;
  orgName: string;
  orgId: string;
  details: string;
  status: "success" | "error";
}

/**
 * Create a demo event object
 */
export function createDemoEvent(
  type: DemoEventType,
  action: DemoEventAction,
  orgName: string,
  orgId: string,
  details: string,
  status: "success" | "error" = "success",
): DemoEvent {
  return {
    id: crypto.randomUUID(),
    type,
    action,
    timestamp: new Date().toISOString(),
    orgName,
    orgId,
    details,
    status,
  };
}
