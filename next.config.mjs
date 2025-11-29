// next.config.mjs

import withPwa from 'next-pwa';

// 1. Define the PWA options separately
const pwaOptions = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development', // Recommended: Disable PWA in development mode
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'firebase-storage-cache',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.firebaseio\.com\/.*/i,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'firebase-data-cache',
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:js|css|woff2?|png|jpg|jpeg|svg|gif|webp)$/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'static-assets-cache',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
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