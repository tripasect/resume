import { LOCALES, LOCALE_META } from '@/i18n'

/**
 * Fixed language switcher: real crawlable links annotated with hreflang, so the
 * alternate locale stays discoverable without JavaScript.
 */
export default function LanguageSwitcher({ locale, label }) {
  return (
    <nav className="lang-switch" aria-label={label}>
      {LOCALES.map((code) => {
        const meta = LOCALE_META[code]
        const isCurrent = code === locale

        return isCurrent ? (
          <span key={code} className="lang-switch-current" aria-current="true" lang={meta.htmlLang}>
            {meta.shortLabel}
          </span>
        ) : (
          <a key={code} href={meta.path} hrefLang={meta.htmlLang} lang={meta.htmlLang}>
            {meta.shortLabel}
          </a>
        )
      })}
    </nav>
  )
}
