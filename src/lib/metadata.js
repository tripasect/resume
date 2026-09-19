import { SITE } from '@/data/resume'
import { LOCALES, LOCALE_META, getDictionary, getLocaleMeta } from '@/i18n'

/** hreflang map shared by metadata and the sitemap. */
export function buildLanguageAlternates() {
  const languages = {}
  for (const locale of LOCALES) {
    languages[LOCALE_META[locale].htmlLang] = LOCALE_META[locale].path
  }
  // Tells crawlers which URL to serve when no language matches the user.
  languages['x-default'] = LOCALE_META.en.path
  return languages
}

const ICONS = {
  icon: [
    { url: '/favicon.svg', type: 'image/svg+xml' },
    { url: '/icons/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    { url: '/icons/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
  ],
  shortcut: '/favicon.svg',
  apple: [
    { url: '/icons/apple-touch-icon.png' },
    { url: '/icons/apple-touch-icon-76x76.png', sizes: '76x76' },
    { url: '/icons/apple-touch-icon-120x120.png', sizes: '120x120' },
    { url: '/icons/apple-touch-icon-152x152.png', sizes: '152x152' },
  ],
}

export const VIEWPORT = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: SITE.themeColor,
  userScalable: false,
}

/** Per-locale metadata: titles, canonical, hreflang, social cards, robots. */
export function buildMetadata(locale = 'en') {
  const dict = getDictionary(locale)
  const meta = getLocaleMeta(locale)
  const otherLocale = locale === 'fa' ? 'en' : 'fa'
  const title = `${dict.meta.displayName} — ${dict.meta.jobTitle}`

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: title,
      template: `%s — ${dict.meta.displayName}`,
    },
    description: dict.meta.description,
    applicationName: SITE.name,
    authors: [{ name: SITE.name, url: SITE.url }],
    creator: SITE.name,
    publisher: SITE.name,
    category: 'technology',
    keywords: dict.meta.keywords,
    alternates: {
      canonical: meta.path,
      languages: buildLanguageAlternates(),
    },
    manifest: '/manifest.json',
    icons: ICONS,
    appleWebApp: {
      capable: true,
      title: SITE.name,
      statusBarStyle: 'black-translucent',
    },
    formatDetection: {
      telephone: false,
      address: false,
      email: false,
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    openGraph: {
      type: 'profile',
      url: meta.path,
      siteName: SITE.name,
      title,
      description: dict.meta.shortDescription,
      locale: meta.ogLocale,
      alternateLocale: [getLocaleMeta(otherLocale).ogLocale],
      firstName: SITE.givenName,
      lastName: SITE.familyName,
      images: [
        {
          url: SITE.ogImage,
          width: SITE.ogImageWidth,
          height: SITE.ogImageHeight,
          alt: dict.meta.ogImageAlt,
          type: 'image/jpeg',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: dict.meta.shortDescription,
      images: [SITE.ogImage],
    },
    other: {
      'msapplication-TileColor': SITE.themeColor,
      'msapplication-TileImage': '/icons/icon-192.png',
    },
  }
}
