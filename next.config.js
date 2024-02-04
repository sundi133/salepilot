/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'avatar.vercel.sh'
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com'
      }
    ]
  },
  webpack: (config, { target }) => {
    config.module.rules.push({
      test: /\.worker\.js$/,
      loader: 'worker-loader',
      options: {
        name: 'static/[hash].worker.js',
        publicPath: '/_next/'
      }
    });

    // Overcome Webpack referencing `window` in chunks
    config.output.globalObject = `(typeof self !== 'undefined' ? self : this)`;

    if (target === 'web') {
      // This is for client-side webpack configuration
      config.node = {
        fs: 'empty' // This tells Webpack to replace 'fs' with an empty module for the browser
      };
    }

    return config;
  },
  reactStrictMode: true,
  compress: true,
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp'
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin'
          },
          {
            key: 'Cache-Control',
            value: 's-maxage=1, stale-while-revalidate=59'
          }
        ]
      }
    ];
  }
};

module.exports = nextConfig;
