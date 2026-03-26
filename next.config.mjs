/** @type {import('next').NextConfig} */

// When building for GitHub Pages (static export), API routes can't be included.
// Set GITHUB_PAGES=true in the Actions workflow (or locally) to produce the
// static ./out directory. Omit it for Vercel / any Node.js host to keep
// API routes and server-side Amadeus integration.
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig = {
  ...(isGitHubPages && {
    output: 'export',
    trailingSlash: true,
  }),
  basePath: process.env.BASE_PATH || '',
  images: {
    // next/image optimisation needs a server; disable for static export
    unoptimized: isGitHubPages,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
