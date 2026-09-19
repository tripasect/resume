import RootHtml from '@/RootHtml'
import { fontClassNames } from '@/i18n/fonts'
import { buildMetadata, VIEWPORT } from '@/lib/metadata'

export const metadata = buildMetadata('fa')
export const viewport = VIEWPORT

/** Root layout for the Persian tree, served from `/fa/`. */
export default function PersianRootLayout({ children }) {
  return (
    <RootHtml locale="fa" fontClassName={fontClassNames('fa')}>
      {children}
    </RootHtml>
  )
}
