/**
 * Analyze Command
 *
 * Analyze font metrics and suggest fallback settings.
 */

import chalk from 'chalk';
import ora from 'ora';
import {
  createDefaultMetrics,
  calculateFallbackAdjustments,
  estimateCLSImprovement,
  findBestMatchingFallback,
  SYSTEM_FONT_METRICS,
} from '@textnode/core';

interface AnalyzeOptions {
  fallback?: string;
  json?: boolean;
}

/**
 * Analyze command handler
 *
 * Note: Full font file parsing requires fontkit which is optional.
 * This provides estimated analysis based on common font metrics.
 */
export async function analyzeCommand(
  fontPath: string | undefined,
  options: AnalyzeOptions
): Promise<void> {
  if (!fontPath) {
    console.log(chalk.bold('Available System Font Metrics:'));
    console.log('');

    for (const [name, metrics] of Object.entries(SYSTEM_FONT_METRICS)) {
      console.log(chalk.cyan(name));
      console.log(`  Ascent: ${metrics.ascent}`);
      console.log(`  Descent: ${metrics.descent}`);
      console.log(`  Line Gap: ${metrics.lineGap}`);
      console.log(`  Units Per Em: ${metrics.unitsPerEm}`);
      console.log('');
    }

    console.log(chalk.yellow('To analyze a custom font file, provide the path:'));
    console.log(chalk.gray('  textnode analyze ./fonts/my-font.woff2'));
    console.log('');
    console.log(chalk.yellow('Note: Full font file parsing requires the fontkit package.'));
    return;
  }

  const spinner = ora('Analyzing font...').start();

  try {
    // For now, use estimated metrics
    // Full implementation would use fontkit to parse the font file
    const fontName = fontPath.split('/').pop()?.split('.')[0] || 'CustomFont';

    spinner.text = 'Calculating metrics...';

    // Create estimated metrics (in production, parse from font file)
    const metrics = createDefaultMetrics(fontName);

    // Find best fallback
    const recommendedFallback = options.fallback || findBestMatchingFallback(metrics);

    // Calculate adjustments
    const adjustments = calculateFallbackAdjustments(metrics, recommendedFallback);

    // Estimate CLS improvement
    const clsEstimate = estimateCLSImprovement(metrics, recommendedFallback);

    spinner.succeed('Analysis complete!');
    console.log('');

    if (options.json) {
      // JSON output
      const output = {
        font: fontName,
        path: fontPath,
        metrics,
        recommendedFallback,
        adjustments,
        clsEstimate,
      };
      console.log(JSON.stringify(output, null, 2));
      return;
    }

    // Formatted output
    console.log(chalk.bold('Font Metrics:'));
    console.log(`  ${chalk.cyan('Family:')} ${metrics.familyName}`);
    console.log(`  ${chalk.cyan('Ascent:')} ${metrics.ascent}`);
    console.log(`  ${chalk.cyan('Descent:')} ${metrics.descent}`);
    console.log(`  ${chalk.cyan('Line Gap:')} ${metrics.lineGap}`);
    console.log(`  ${chalk.cyan('Units Per Em:')} ${metrics.unitsPerEm}`);
    if (metrics.capHeight) {
      console.log(`  ${chalk.cyan('Cap Height:')} ${metrics.capHeight}`);
    }
    if (metrics.xHeight) {
      console.log(`  ${chalk.cyan('x-Height:')} ${metrics.xHeight}`);
    }
    console.log('');

    console.log(chalk.bold('Recommended Fallback:'), chalk.green(recommendedFallback));
    console.log('');

    console.log(chalk.bold('CSS Overrides:'));
    console.log(`  ${chalk.cyan('ascent-override:')} ${adjustments.ascentOverride}`);
    console.log(`  ${chalk.cyan('descent-override:')} ${adjustments.descentOverride}`);
    console.log(`  ${chalk.cyan('line-gap-override:')} ${adjustments.lineGapOverride}`);
    console.log(`  ${chalk.cyan('size-adjust:')} ${adjustments.sizeAdjust}`);
    console.log('');

    console.log(chalk.bold('Estimated CLS Improvement:'));
    const beforeColor = clsEstimate.before > 0.1 ? chalk.red : chalk.yellow;
    const afterColor = clsEstimate.after < 0.05 ? chalk.green : chalk.yellow;
    console.log(`  Before: ${beforeColor(clsEstimate.before.toFixed(2))}`);
    console.log(`  After:  ${afterColor(clsEstimate.after.toFixed(2))}`);
    console.log('');

    console.log(chalk.bold('Generated Configuration:'));
    console.log('');
    console.log(chalk.gray(`fallback: {`));
    console.log(chalk.gray(`  font: '${recommendedFallback}',`));
    console.log(chalk.gray(`  ascentOverride: '${adjustments.ascentOverride}',`));
    console.log(chalk.gray(`  descentOverride: '${adjustments.descentOverride}',`));
    console.log(chalk.gray(`  lineGapOverride: '${adjustments.lineGapOverride}',`));
    console.log(chalk.gray(`  sizeAdjust: '${adjustments.sizeAdjust}',`));
    console.log(chalk.gray(`}`));
    console.log('');

    console.log(
      chalk.yellow('Note: For more accurate metrics, install fontkit:'),
      chalk.gray('npm install fontkit')
    );

  } catch (error) {
    spinner.fail(chalk.red('Failed to analyze font'));
    console.error(error);
    process.exit(1);
  }
}
