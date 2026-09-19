const PERSIAN_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/**
 * Renders ASCII digits using the locale's numbering system.
 *
 * Display only: machine-readable values (schema.org `telephone`, `tel:` hrefs,
 * JSON payloads) must keep ASCII digits, so always format at the render site
 * rather than storing converted values.
 */
export function toLocaleDigits(value, locale) {
  const text = String(value)
  if (locale !== 'fa') return text
  return text.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)])
}
