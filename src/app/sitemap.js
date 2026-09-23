import { SITE } from '@/data/resume'
import { LOCALES, LOCALE_META } from '@/i18n'

export const dynamic = 'force-static'

const absolute = (path) => new URL(path, SITE.url).href

export default function sitemap() {
  const lastModified = new Date()

  // Every entry advertises the full alternate-language set so crawlers can pair
  // the English and Persian pages. Both locales get equal priority: the
  // Persian page is the primary target for the Iranian job market.
  const languages = {}
  for (const locale of LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = absolute(LOCALE_META[locale].path)
  }
  languages['x-default'] = absolute(LOCALE_META.en.path)

  return LOCALES.map((locale) => ({
    url: absolute(LOCALE_META[locale].path),
    lastModified,
    changeFrequency: 'weekly',
    priority: locale === 'en' ? 0.95 : 1,
    alternates: { languages },
  }))
}
