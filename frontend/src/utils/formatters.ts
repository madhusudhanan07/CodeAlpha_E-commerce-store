/**
 * formatters.ts — General-Purpose Formatting Utilities
 *
 * Pure functions — no side effects, no imports.
 * Easy to unit-test independently.
 */

/**
 * Formats a numeric price to a locale-aware currency string.
 *
 * @param amount   - The numeric price value
 * @param currency - ISO 4217 currency code (default: 'USD')
 * @param locale   - BCP 47 locale tag (default: 'en-US')
 *
 * @example
 *   formatPrice(1999.9)         // "$1,999.90"
 *   formatPrice(1999.9, 'INR')  // "₹1,999.90"
 */
export const formatPrice = (
  amount: number,
  currency = 'USD',
  locale = 'en-US',
): string =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);

/**
 * Truncates a string to a maximum length, appending an ellipsis if needed.
 *
 * @example
 *   truncate('Hello World', 7) // "Hello W..."
 */
export const truncate = (text: string, maxLength: number): string =>
  text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;

/**
 * Capitalizes the first letter of each word in a string.
 *
 * @example
 *   toTitleCase('hello world') // "Hello World"
 */
export const toTitleCase = (str: string): string =>
  str.replace(/\b\w/g, (char) => char.toUpperCase());

/**
 * Formats an ISO date string to a readable date.
 *
 * @example
 *   formatDate('2025-07-12T00:00:00Z') // "Jul 12, 2025"
 */
export const formatDate = (isoString: string, locale = 'en-US'): string =>
  new Date(isoString).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
