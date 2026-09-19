/**
 * Locale registry.
 *
 * English is served from the site root (`/`) so the existing canonical URL and
 * accumulated authority are preserved; Persian lives under `/fa/`. Static export
 * cannot use Next's built-in `i18n` routing (it needs a server), so each locale
 * gets its own route group with its own root layout.
 */

export const LOCALES = ['en', 'fa']

export const DEFAULT_LOCALE = 'en'

export const LOCALE_META = {
  en: {
    dir: 'ltr',
    htmlLang: 'en',
    ogLocale: 'en_US',
    /** Path of this locale's home page. */
    path: '/',
    /** Path of the *other* locale, for the switcher. */
    switchPath: '/fa/',
    switchLabel: 'فارسی',
    switchLangAttr: 'fa',
    label: 'English',
    /** Compact label for the switcher control. */
    shortLabel: 'EN',
  },
  fa: {
    dir: 'rtl',
    htmlLang: 'fa',
    ogLocale: 'fa_IR',
    path: '/fa/',
    switchPath: '/',
    switchLabel: 'English',
    switchLangAttr: 'en',
    label: 'فارسی',
    shortLabel: 'فا',
  },
}

export const isLocale = (value) => LOCALES.includes(value)

export function getLocaleMeta(locale) {
  return LOCALE_META[isLocale(locale) ? locale : DEFAULT_LOCALE]
}
