/**
 * Next.js Plugin
 *
 * Provides withTextnode wrapper for next.config.js
 */

import type { NextConfig } from 'next';

/**
 * Textnode plugin options
 */
export interface TextnodePluginOptions {
  /** Path to textnode configuration file */
  configPath?: string;
  /** Disable font optimization (not recommended) */
  disableOptimization?: boolean;
}

/**
 * Combined Next.js config with textnode options
 */
export interface NextConfigWithTextnode extends NextConfig {
  textnode?: TextnodePluginOptions;
}

/**
 * withTextnode Plugin
 *
 * Wraps your Next.js configuration to add textnode support.
 *
 * @example
 * ```js
 * // next.config.js
 * const { withTextnode } = require('@textnode/nextjs');
 *
 * module.exports = withTextnode({
 *   // your next.js config
 *   reactStrictMode: true,
 *   textnode: {
 *     configPath: './textnode.config.ts'
 *   }
 * });
 * ```
 */
export function withTextnode(
  nextConfig: NextConfigWithTextnode = {}
): NextConfig {
  const { textnode: textnodeOptions, ...restConfig } = nextConfig;

  return {
    ...restConfig,

    // Ensure proper transpilation of textnode packages
    transpilePackages: [
      ...(restConfig.transpilePackages || []),
      '@textnode/core',
      '@textnode/react',
    ],

    // Add webpack configuration for font handling
    webpack: (config, options) => {
      // Add font file handling
      config.module.rules.push({
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'static/fonts/[hash][ext][query]',
        },
      });

      // Call user's webpack config if provided
      if (typeof restConfig.webpack === 'function') {
        return restConfig.webpack(config, options);
      }

      return config;
    },

    // Add headers for font caching
    async headers() {
      const userHeaders = restConfig.headers
        ? await restConfig.headers()
        : [];

      return [
        ...userHeaders,
        {
          source: '/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
        {
          source: '/_next/static/fonts/:path*',
          headers: [
            {
              key: 'Cache-Control',
              value: 'public, max-age=31536000, immutable',
            },
          ],
        },
      ];
    },
  };
}
