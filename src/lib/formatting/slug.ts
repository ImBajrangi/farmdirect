/**
 * Devanagari & Latin URL Sanitization Utility
 * Strictly adheres to Devanagari URL Sanitization Rule:
 * Performs decodeURIComponent before encodeURIComponent to prevent double-encoding redirect loops.
 */
export function sanitizeSlug(text: string): string {
  if (!text) return '';

  let normalized = text;
  try {
    // Prevent double encoding
    normalized = decodeURIComponent(text);
  } catch {
    // already raw
  }

  // Trim, lower-case, replace spaces and punctuation with hyphens
  const cleaned = normalized
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '') // Keep unicode letters (Latin, Devanagari) & numbers
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

  return encodeURIComponent(cleaned);
}
