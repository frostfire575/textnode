/**
 * Init Command
 *
 * Initialize a new textnode configuration file.
 */

import * as fs from 'fs';
import * as path from 'path';
import chalk from 'chalk';
import ora from 'ora';

interface InitOptions {
  yes?: boolean;
  typescript?: boolean;
  javascript?: boolean;
  path?: string;
}

/**
 * Default TypeScript configuration template
 */
const TYPESCRIPT_TEMPLATE = `import { defineConfig } from '@textnode/core';

export default defineConfig({
  // Font definitions
  fonts: {
    heading: {
      name: 'Your Heading Font',
      files: {
        400: './fonts/heading-regular.woff2',
        600: './fonts/heading-semibold.woff2',
        700: './fonts/heading-bold.woff2',
      },
      fallback: {
        font: 'Arial',
        auto: true,
      },
      display: 'swap',
      preload: true,
      variable: '--font-heading',
    },
    body: {
      name: 'Your Body Font',
      files: {
        400: './fonts/body-regular.woff2',
        500: './fonts/body-medium.woff2',
      },
      fallback: {
        font: 'system-ui',
        auto: true,
      },
      display: 'swap',
      preload: true,
      variable: '--font-body',
    },
  },

  // Type scale configuration
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major Third
  },

  // Text style variants
  variants: {
    h1: {
      fontSize: '5xl',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: 'heading',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '4xl',
      fontWeight: 600,
      lineHeight: 1.25,
      fontFamily: 'heading',
    },
    h3: {
      fontSize: '3xl',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: 'heading',
    },
    body: {
      fontSize: 'base',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: 'body',
    },
    caption: {
      fontSize: 'sm',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: 'body',
    },
  },

  // Optimization settings
  optimization: {
    layoutShift: {
      prevention: 'balanced',
      fallbackMatching: true,
      preload: true,
    },
  },
});
`;

/**
 * Default JavaScript configuration template
 */
const JAVASCRIPT_TEMPLATE = `const { defineConfig } = require('@textnode/core');

module.exports = defineConfig({
  // Font definitions
  fonts: {
    heading: {
      name: 'Your Heading Font',
      files: {
        400: './fonts/heading-regular.woff2',
        600: './fonts/heading-semibold.woff2',
        700: './fonts/heading-bold.woff2',
      },
      fallback: {
        font: 'Arial',
        auto: true,
      },
      display: 'swap',
      preload: true,
      variable: '--font-heading',
    },
    body: {
      name: 'Your Body Font',
      files: {
        400: './fonts/body-regular.woff2',
        500: './fonts/body-medium.woff2',
      },
      fallback: {
        font: 'system-ui',
        auto: true,
      },
      display: 'swap',
      preload: true,
      variable: '--font-body',
    },
  },

  // Type scale configuration
  scale: {
    type: 'modular',
    base: 16,
    ratio: 1.25, // Major Third
  },

  // Text style variants
  variants: {
    h1: {
      fontSize: '5xl',
      fontWeight: 700,
      lineHeight: 1.2,
      fontFamily: 'heading',
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '4xl',
      fontWeight: 600,
      lineHeight: 1.25,
      fontFamily: 'heading',
    },
    h3: {
      fontSize: '3xl',
      fontWeight: 600,
      lineHeight: 1.3,
      fontFamily: 'heading',
    },
    body: {
      fontSize: 'base',
      fontWeight: 400,
      lineHeight: 1.5,
      fontFamily: 'body',
    },
    caption: {
      fontSize: 'sm',
      fontWeight: 500,
      lineHeight: 1.4,
      fontFamily: 'body',
    },
  },

  // Optimization settings
  optimization: {
    layoutShift: {
      prevention: 'balanced',
      fallbackMatching: true,
      preload: true,
    },
  },
});
`;

/**
 * Init command handler
 */
export async function initCommand(options: InitOptions): Promise<void> {
  const spinner = ora('Creating textnode configuration...').start();

  try {
    // Determine file format
    const useTypeScript = options.javascript ? false : true;
    const extension = useTypeScript ? '.ts' : '.js';
    const template = useTypeScript ? TYPESCRIPT_TEMPLATE : JAVASCRIPT_TEMPLATE;

    // Determine output path
    const outputDir = options.path || process.cwd();
    const fileName = `textnode.config${extension}`;
    const filePath = path.join(outputDir, fileName);

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      spinner.fail(chalk.red(`Configuration file already exists: ${filePath}`));
      console.log(chalk.yellow('Use a different path with --path or remove the existing file.'));
      process.exit(1);
    }

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write configuration file
    fs.writeFileSync(filePath, template, 'utf-8');

    spinner.succeed(chalk.green('Configuration created successfully!'));

    console.log('');
    console.log(chalk.cyan('Created:'), filePath);
    console.log('');
    console.log(chalk.bold('Next steps:'));
    console.log('');
    console.log('  1. Update font paths in the configuration');
    console.log('  2. Customize variants for your design system');
    console.log('  3. Import and use in your React app:');
    console.log('');
    console.log(chalk.gray('     import { TypographyProvider } from "@textnode/react";'));
    console.log(chalk.gray('     import config from "./textnode.config";'));
    console.log('');
    console.log(chalk.gray('     <TypographyProvider config={config}>'));
    console.log(chalk.gray('       <App />'));
    console.log(chalk.gray('     </TypographyProvider>'));
    console.log('');

  } catch (error) {
    spinner.fail(chalk.red('Failed to create configuration'));
    console.error(error);
    process.exit(1);
  }
}
