import '@/app/globals.css'

import { getDictionary, getLocaleMeta } from '@/i18n'
import { buildJsonLd } from '@/lib/schema'
import LanguageSwitcher from '@/LanguageSwitcher'

/**
 * Shared document shell for every locale.
 *
 * `lang` and `dir` must be decided on the server so crawlers receive the correct
 * writing direction in the HTML itself, which is why each locale route group has
 * its own root layout that delegates here. The font class is passed in rather
 * than imported, so each route only pulls its own font files.
 */
export default function RootHtml({ locale, fontClassName, children }) {
  const dict = getDictionary(locale)
  const meta = getLocaleMeta(locale)
  const jsonLd = buildJsonLd(locale)

  return (
    <html
      lang={meta.htmlLang}
      dir={meta.dir}
      className={fontClassName}
      suppressHydrationWarning
    >
      <body>
        <a className="skip-link" href="#main">
          {dict.a11y.skipToContent}
        </a>

        <LanguageSwitcher locale={locale} label={dict.a11y.languageSwitcherLabel} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {children}
      </body>
    </html>
  )
}
