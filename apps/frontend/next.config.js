/** @type {import('next').NextConfig} */
const nextConfig = {
  // Avoid an extra redirect hop on every /api/* call before it reaches our
  // catch-all proxy route (app/api/[...path]/route.ts), which normalizes the
  // trailing slash itself before forwarding to Django.
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
