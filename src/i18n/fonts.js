import { Bebas_Neue, Inter, Alexandria } from 'next/font/google'

/**
 * Self-hosted at build time: no third-party font request, no render-blocking
 * @import, and stable metrics to avoid layout shift.
 *
 * Alexandria is served by Google Fonts for both locales. Latin pages pair it
 * with Bebas Neue and Inter; Bebas Neue and Inter carry no Arabic glyphs, so
 * Persian pages use Alexandria's Arabic subset for all three typographic roles.
 */

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-bebas',
})

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const alexandria = Alexandria({
  subsets: ['latin', 'arabic'],
  display: 'swap',
  variable: '--font-alexandria',
})

/** Locale-specific `className` carrying the CSS variables above. */
export function fontClassNames(locale) {
  if (locale === 'fa') return alexandria.variable
  return `${bebasNeue.variable} ${inter.variable} ${alexandria.variable}`
}
