import '@/app/globals.css'

import { getDictionary } from '@/i18n'
import { fontClassNames } from '@/i18n/fonts'
import { SITE } from '@/data/resume'

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: true },
}

/**
 * Serves unmatched URLs (exported as `out/404.html`).
 *
 * This file renders its own document because each locale route group owns its
 * root layout, so no shared layout is available here. The locale of the missing
 * URL is unknowable at this point, so the message is shown in both languages
 * with explicit `lang` attributes rather than guessing wrong.
 */
export default function GlobalNotFound() {
  const en = getDictionary('en')
  const fa = getDictionary('fa')

  // Apply font class names for both locales so every --font-* CSS variable
  // is defined. The 'en' set (Bebas Neue + Inter + Alexandria) is a superset
  // of the 'fa' set (Alexandria only), so using the 'en' classes is sufficient.
  const fontClass = fontClassNames('en')

  return (
    <html lang="en" dir="ltr" className={fontClass} suppressHydrationWarning>
      <body>
        <main
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(4rem, 14vw, 10rem)', margin: 0 }}>
            404
          </p>

          <div>
            <h1 style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em', margin: '0 0 1rem' }}>
              {en.notFound.heading}
            </h1>
            <p style={{ color: 'var(--fg-muted)', maxWidth: '34rem', margin: '0 auto' }}>
              {en.notFound.body}
            </p>
          </div>

          <div lang="fa" dir="rtl">
            <h2 style={{ fontFamily: 'var(--font-display)', margin: '0 0 1rem' }}>
              {fa.notFound.heading}
            </h2>
            <p style={{ color: 'var(--fg-muted)', maxWidth: '34rem', margin: '0 auto' }}>
              {fa.notFound.body}
            </p>
          </div>

          <nav
            aria-label="Language"
            style={{
              display: 'flex',
              gap: '1.5rem',
              fontFamily: 'var(--font-ui)',
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              marginTop: '0.5rem',
            }}
          >
            <a href={SITE.url} style={{ color: 'var(--accent-2)' }}>
              {en.notFound.link}
            </a>
            <a href="/fa/" hrefLang="fa" lang="fa" dir="rtl" style={{ color: 'var(--accent-2)' }}>
              {fa.notFound.link}
            </a>
          </nav>
        </main>
      </body>
    </html>
  )
}
