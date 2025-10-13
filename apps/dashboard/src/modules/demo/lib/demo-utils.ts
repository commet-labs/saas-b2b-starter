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
