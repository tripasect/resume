import { SITE, SKILLS, ALL_PROJECTS } from '@/data/resume'
import { getDictionary, getLocaleMeta } from '@/i18n'

const absolute = (path) => new URL(path, SITE.url).href

/**
 * Builds one linked schema.org graph per locale.
 *
 * A `@graph` with stable `@id`s lets search engines and AI indexers join the
 * website, the person, the résumé page, and the project list together instead
 * of treating them as unrelated blobs. The `Person` node keeps the same `@id`
 * in every language, so the translated pages describe one entity.
 */
export function buildJsonLd(locale = 'en') {
  const dict = getDictionary(locale)
  const isFa = locale === 'fa'

  const personId = `${SITE.url}/#person`
  const websiteId = `${SITE.url}/#website`
  const imageId = `${SITE.url}/#primaryimage`
  const pageId = `${absolute(getLocaleMeta(locale).path)}#profilepage`
  const projectsId = `${absolute(getLocaleMeta(locale).path)}#projects`

  const projects = ALL_PROJECTS.map((project, index) => ({
    '@type': 'SoftwareApplication',
    '@id': `${SITE.url}/#project-${project.id}`,
    name: project.name,
    description: dict.projects[project.id]?.description,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    ...(project.href ? { url: project.href } : {}),
    author: { '@id': personId },
    keywords: project.tech,
    position: index + 1,
  }))

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: SITE.url,
        name: SITE.name,
        description: dict.meta.shortDescription,
        inLanguage: getLocaleMeta(locale).htmlLang,
        publisher: { '@id': personId },
      },
      {
        '@type': 'Person',
        '@id': personId,
        name: SITE.name,
        alternateName: SITE.alternateName,
        givenName: SITE.givenName,
        familyName: SITE.familyName,
        url: SITE.url,
        image: { '@id': imageId },
        jobTitle: dict.meta.jobTitle,
        description: dict.meta.description,
        email: `mailto:${SITE.email}`,
        telephone: SITE.phone,
        sameAs: [SITE.github],
        knowsLanguage: SITE.knowsLanguage,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: isFa ? SITE.alumniOfFa : SITE.alumniOf,
        },
        hasCredential: {
          '@type': 'EducationalOccupationalCredential',
          credentialCategory: 'degree',
          name: isFa ? SITE.degreeFa : SITE.degree,
        },
        knowsAbout: SKILLS,
        address: {
          '@type': 'PostalAddress',
          addressCountry: SITE.addressCountry,
        },
      },
      {
        '@type': 'ProfilePage',
        '@id': pageId,
        url: absolute(getLocaleMeta(locale).path),
        name: `${dict.meta.displayName} — ${dict.meta.jobTitle}`,
        description: dict.meta.description,
        inLanguage: getLocaleMeta(locale).htmlLang,
        isPartOf: { '@id': websiteId },
        about: { '@id': personId },
        mainEntity: { '@id': personId },
        primaryImageOfPage: { '@id': imageId },
        hasPart: { '@id': projectsId },
      },
      {
        '@type': 'ImageObject',
        '@id': imageId,
        url: absolute(SITE.ogImage),
        contentUrl: absolute(SITE.ogImage),
        width: SITE.ogImageWidth,
        height: SITE.ogImageHeight,
        caption: `${SITE.name} — ${dict.meta.jobTitle}`,
      },
      {
        '@type': 'ItemList',
        '@id': projectsId,
        name: dict.chapters.apps.title,
        numberOfItems: projects.length,
        itemListOrder: 'https://schema.org/ItemListOrderAscending',
        itemListElement: projects.map((project) => ({
          '@type': 'ListItem',
          position: project.position,
          item: project,
        })),
      },
    ],
  }
}
