/**
 * Utility functions for organization slug generation and validation
 */

/**
 * Generates a URL-friendly slug from a name
 */
export function generateSlugFromName(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      // Replace spaces and special characters with hyphens
      .replace(/[^a-z0-9]+/g, "-")
      // Remove leading/trailing hyphens
      .replace(/^-+|-+$/g, "")
      // Remove consecutive hyphens
      .replace(/-+/g, "-")
      // Limit to 44 characters to leave room for random suffix if needed
      .substring(0, 44)
  );
}

/**
 * Generates a random 4-character suffix
 */
export function generateRandomSuffix(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generates a unique slug by checking availability and adding random suffix if needed
 */
export async function generateUniqueSlug(
  name: string,
  isAvailable: (slug: string) => Promise<boolean>,
): Promise<string> {
  const baseSlug = generateSlugFromName(name);

  if (!baseSlug) {
    // If name couldn't generate a valid slug, use default with random
    return `org-${generateRandomSuffix()}`;
  }

  // First try the base slug
  if (await isAvailable(baseSlug)) {
    return baseSlug;
  }

  // If not available, try with random suffix
  const slugWithSuffix = `${baseSlug}-${generateRandomSuffix()}`;
  return slugWithSuffix;
}
