/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fully static pre-rendered output in `out/`, deployable to Cloudflare Pages.
  output: 'export',

  // Emit `path/index.html` so every host serves the same canonical URL shape.
  trailingSlash: true,

  // Static export has no image optimization server; assets are already sized.
  images: { unoptimized: true },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    // Required so a single 404 page can serve unmatched URLs when each locale
    // route group provides its own root layout.
    globalNotFound: true,
  },
}

export default nextConfig
