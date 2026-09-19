import RootHtml from '@/RootHtml'
import { fontClassNames } from '@/i18n/fonts'
import { buildMetadata, VIEWPORT } from '@/lib/metadata'

export const metadata = buildMetadata('en')
export const viewport = VIEWPORT

/** Root layout for the English tree, served from `/`. */
export default function EnglishRootLayout({ children }) {
  return (
    <RootHtml locale="en" fontClassName={fontClassNames('en')}>
      {children}
    </RootHtml>
  )
}
