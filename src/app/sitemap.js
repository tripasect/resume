import { SITE } from '@/data/resume'
import { LOCALES, LOCALE_META } from '@/i18n'

export const dynamic = 'force-static'

const absolute = (path) => new URL(path, SITE.url).href

export default function sitemap() {
  const lastModified = new Date()

  // Every entry advertises the full alternate-language set so crawlers can pair
  // the English and Persian pages.
  const languages = {}
  for (const locale of LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = absolute(LOCALE_META[locale].path)
  }
  languages['x-default'] = absolute(LOCALE_META.en.path)

  return LOCALES.map((locale) => ({
    url: absolute(LOCALE_META[locale].path),
    lastModified,
    changeFrequency: 'monthly',
    priority: locale === 'en' ? 1 : 0.9,
    alternates: { languages },
  }))
}
