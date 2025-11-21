/**
 * Configuration validation utilities
 */

import type {
  TextnodeConfig,
  FontDefinition,
  ScaleConfig,
  VariantDefinition,
  FontWeight,
} from '../types';

/** Validation error with helpful message */
export class ConfigValidationError extends Error {
  constructor(
    message: string,
    public path: string,
    public suggestion?: string
  ) {
    super(
      suggestion
        ? `${message}\n  Path: ${path}\n  Suggestion: ${suggestion}`
        : `${message}\n  Path: ${path}`
    );
    this.name = 'ConfigValidationError';
  }
}

/** Validation result */
export interface ValidationResult {
  valid: boolean;
  errors: ConfigValidationError[];
  warnings: string[];
}

/** Valid font weights */
const VALID_WEIGHTS: FontWeight[] = [100, 200, 300, 400, 500, 600, 700, 800, 900];

/** Valid font display values */
const VALID_FONT_DISPLAY = ['auto', 'block', 'swap', 'fallback', 'optional'];

/** Valid scale types */
const VALID_SCALE_TYPES = ['modular', 'fixed', 'fluid', 'custom'];

/**
 * Validate font definition
 */
function validateFont(
  fontKey: string,
  font: FontDefinition,
  result: ValidationResult
): void {
  const path = `fonts.${fontKey}`;

  // Required: name
  if (!font.name || typeof font.name !== 'string') {
    result.errors.push(
      new ConfigValidationError(
        'Font must have a "name" property',
        path,
        `Add a name property: { name: "${fontKey}" }`
      )
    );
  }

  // Required: files
  if (!font.files || typeof font.files !== 'object') {
    result.errors.push(
      new ConfigValidationError(
        'Font must have a "files" property with font file paths',
        path,
        'Add font files: { files: { 400: "./fonts/font-regular.woff2" } }'
      )
    );
  } else {
    // Validate each file entry
    const weights = Object.keys(font.files);
    if (weights.length === 0) {
      result.warnings.push(
        `${path}: No font files specified. Add at least one weight.`
      );
    }

    for (const weight of weights) {
      const weightNum = parseInt(weight, 10);
      if (!VALID_WEIGHTS.includes(weightNum as FontWeight)) {
        result.errors.push(
          new ConfigValidationError(
            `Invalid font weight: ${weight}`,
            `${path}.files.${weight}`,
            `Valid weights are: ${VALID_WEIGHTS.join(', ')}`
          )
        );
      }

      const filePath = font.files[weightNum as FontWeight];
      if (typeof filePath !== 'string') {
        result.errors.push(
          new ConfigValidationError(
            'Font file path must be a string',
            `${path}.files.${weight}`,
            'Provide a valid file path'
          )
        );
      }
    }
  }

  // Optional: display
  if (font.display && !VALID_FONT_DISPLAY.includes(font.display)) {
    result.errors.push(
      new ConfigValidationError(
        `Invalid font-display value: ${font.display}`,
        `${path}.display`,
        `Valid values are: ${VALID_FONT_DISPLAY.join(', ')}`
      )
    );
  }

  // Optional: fallback
  if (font.fallback) {
    if (typeof font.fallback !== 'object') {
      result.errors.push(
        new ConfigValidationError(
          'Fallback must be an object',
          `${path}.fallback`,
          '{ font: "Arial", auto: true }'
        )
      );
    } else if (!font.fallback.font) {
      result.errors.push(
        new ConfigValidationError(
          'Fallback must have a "font" property',
          `${path}.fallback`,
          'Specify a system font: { font: "Arial" }'
        )
      );
    }
  }
}

/**
 * Validate scale configuration
 */
function validateScale(scale: ScaleConfig, result: ValidationResult): void {
  const path = 'scale';

  if (!scale.type || !VALID_SCALE_TYPES.includes(scale.type)) {
    result.errors.push(
      new ConfigValidationError(
        `Invalid scale type: ${scale.type}`,
        `${path}.type`,
        `Valid types are: ${VALID_SCALE_TYPES.join(', ')}`
      )
    );
    return;
  }

  switch (scale.type) {
    case 'modular':
      if (typeof scale.base !== 'number' || scale.base <= 0) {
        result.errors.push(
          new ConfigValidationError(
            'Modular scale requires a positive "base" value',
            `${path}.base`,
            'Common base value: 16'
          )
        );
      }
      if (typeof scale.ratio !== 'number' || scale.ratio <= 0) {
        result.errors.push(
          new ConfigValidationError(
            'Modular scale requires a positive "ratio" value',
            `${path}.ratio`,
            'Common ratios: 1.25 (Major Third), 1.5 (Perfect Fifth), 1.618 (Golden Ratio)'
          )
        );
      }
      break;

    case 'fixed':
      if (!scale.values || typeof scale.values !== 'object') {
        result.errors.push(
          new ConfigValidationError(
            'Fixed scale requires a "values" object',
            `${path}.values`,
            '{ xs: 12, sm: 14, base: 16, lg: 18, xl: 20 }'
          )
        );
      } else {
        for (const [key, value] of Object.entries(scale.values)) {
          if (typeof value !== 'number' || value <= 0) {
            result.errors.push(
              new ConfigValidationError(
                `Scale value "${key}" must be a positive number`,
                `${path}.values.${key}`,
                'Provide a pixel value like 16'
              )
            );
          }
        }
      }
      break;

    case 'fluid':
      if (typeof scale.minViewport !== 'number' || scale.minViewport <= 0) {
        result.errors.push(
          new ConfigValidationError(
            'Fluid scale requires positive "minViewport" value',
            `${path}.minViewport`,
            'Common value: 320'
          )
        );
      }
      if (typeof scale.maxViewport !== 'number' || scale.maxViewport <= 0) {
        result.errors.push(
          new ConfigValidationError(
            'Fluid scale requires positive "maxViewport" value',
            `${path}.maxViewport`,
            'Common value: 1920'
          )
        );
      }
      if (scale.minViewport >= scale.maxViewport) {
        result.errors.push(
          new ConfigValidationError(
            'minViewport must be less than maxViewport',
            path,
            'Example: minViewport: 320, maxViewport: 1920'
          )
        );
      }
      break;

    case 'custom':
      if (!scale.values || typeof scale.values !== 'object') {
        result.errors.push(
          new ConfigValidationError(
            'Custom scale requires a "values" object',
            `${path}.values`,
            'Provide key-value pairs with sizes'
          )
        );
      }
      break;
  }
}

/**
 * Validate variant definition
 */
function validateVariant(
  variantKey: string,
  variant: VariantDefinition,
  fontKeys: string[],
  result: ValidationResult
): void {
  const path = `variants.${variantKey}`;

  // Required: fontSize
  if (variant.fontSize === undefined) {
    result.errors.push(
      new ConfigValidationError(
        'Variant must have a "fontSize" property',
        path,
        'Use a scale key like "base" or a number like 16'
      )
    );
  }

  // Optional: fontWeight
  if (
    variant.fontWeight !== undefined &&
    !VALID_WEIGHTS.includes(variant.fontWeight)
  ) {
    result.errors.push(
      new ConfigValidationError(
        `Invalid font weight: ${variant.fontWeight}`,
        `${path}.fontWeight`,
        `Valid weights are: ${VALID_WEIGHTS.join(', ')}`
      )
    );
  }

  // Optional: fontFamily reference
  if (variant.fontFamily && !fontKeys.includes(variant.fontFamily)) {
    result.warnings.push(
      `${path}.fontFamily: "${variant.fontFamily}" is not defined in fonts config. ` +
        `Available fonts: ${fontKeys.join(', ')}`
    );
  }

  // Optional: lineHeight
  if (variant.lineHeight !== undefined) {
    const lh = variant.lineHeight;
    if (typeof lh === 'number' && lh <= 0) {
      result.errors.push(
        new ConfigValidationError(
          'lineHeight must be positive',
          `${path}.lineHeight`,
          'Common values: 1.2, 1.5, 1.75'
        )
      );
    }
  }
}

/**
 * Validate complete configuration
 */
export function validateConfig(config: TextnodeConfig): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    warnings: [],
  };

  // Validate fonts
  if (!config.fonts || typeof config.fonts !== 'object') {
    result.errors.push(
      new ConfigValidationError(
        'Configuration must have a "fonts" property',
        'fonts',
        'Define at least one font: fonts: { heading: { name: "...", files: { ... } } }'
      )
    );
  } else {
    const fontKeys = Object.keys(config.fonts);
    if (fontKeys.length === 0) {
      result.warnings.push(
        'No fonts defined. Add at least one font to use textnode effectively.'
      );
    }
    for (const [key, font] of Object.entries(config.fonts)) {
      validateFont(key, font, result);
    }
  }

  // Validate scale
  if (!config.scale) {
    result.errors.push(
      new ConfigValidationError(
        'Configuration must have a "scale" property',
        'scale',
        'Define a scale: scale: { type: "modular", base: 16, ratio: 1.25 }'
      )
    );
  } else {
    validateScale(config.scale, result);
  }

  // Validate variants
  if (config.variants) {
    const fontKeys = config.fonts ? Object.keys(config.fonts) : [];
    for (const [key, variant] of Object.entries(config.variants)) {
      validateVariant(key, variant, fontKeys, result);
    }
  }

  // Set valid flag
  result.valid = result.errors.length === 0;

  return result;
}

/**
 * Validate and throw on error
 */
export function assertValidConfig(config: TextnodeConfig): void {
  const result = validateConfig(config);
  if (!result.valid) {
    const errorMessages = result.errors.map((e) => e.message).join('\n\n');
    throw new Error(`Invalid textnode configuration:\n\n${errorMessages}`);
  }
}
