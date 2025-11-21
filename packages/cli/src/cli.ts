#!/usr/bin/env node
/**
 * Textnode CLI
 *
 * Command-line interface for textnode typography system.
 */

import { Command } from 'commander';
import { initCommand } from './commands/init';
import { analyzeCommand } from './commands/analyze';
import { exportCommand } from './commands/export';

const program = new Command();

program
  .name('textnode')
  .description('Typography system CLI for font management and analysis')
  .version('0.1.0');

// Init command
program
  .command('init')
  .description('Initialize a new textnode configuration')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('-t, --typescript', 'Generate TypeScript config (default)')
  .option('-j, --javascript', 'Generate JavaScript config')
  .option('-p, --path <path>', 'Output path for config file')
  .action(initCommand);

// Analyze command
program
  .command('analyze [fontPath]')
  .description('Analyze font metrics and suggest fallback settings')
  .option('-f, --fallback <font>', 'Specify fallback font to compare against')
  .option('--json', 'Output as JSON')
  .action(analyzeCommand);

// Export command
program
  .command('export')
  .description('Export typography configuration as design tokens')
  .option('-f, --format <format>', 'Export format (css-vars, tailwind, json, scss)', 'css-vars')
  .option('-o, --output <path>', 'Output file path')
  .option('-c, --config <path>', 'Path to textnode config file')
  .action(exportCommand);

// Parse arguments
program.parse();
