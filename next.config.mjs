// next.config.mjs

import withPwa from 'next-pwa';

// 1. Define the PWA options separately
const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Recommended: Disable PWA in development mode
};

// 2. Define your base Next.js configuration
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Your Next.js specific settings
  reactStrictMode: true,
  turbopack: {
    // Note: 'turbopack: {}' is usually empty unless you have specific options
  },
};

// 3. Chain them correctly: Call withPwa with the options, and pass the result 
//    directly to the default export.
export default withPwa(pwaOptions)(nextConfig);

// OR (Alternative chaining style, also works):
// const withPWA = withPwa(pwaOptions);
// export default withPWA(nextConfig);