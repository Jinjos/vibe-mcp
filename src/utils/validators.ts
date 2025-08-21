import { access, constants } from 'fs/promises';
import path from 'path';

/**
 * Input validation utilities for MCP tools
 */

export class ValidationError extends Error {
  constructor(message: string, public field?: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

/**
 * Validate that a project path exists and is accessible
 */
export async function validateProjectPath(projectPath: string): Promise<void> {
  if (!projectPath) {
    throw new ValidationError('Project path is required', 'projectPath');
  }

  if (typeof projectPath !== 'string') {
    throw new ValidationError('Project path must be a string', 'projectPath');
  }

  try {
    await access(projectPath, constants.R_OK);
  } catch (error) {
    throw new ValidationError(`Project path does not exist or is not accessible: ${projectPath}`, 'projectPath');
  }

  // Check if it's a directory (basic check)
  const stat = await import('fs/promises').then(fs => fs.stat(projectPath));
  if (!stat.isDirectory()) {
    throw new ValidationError(`Project path must be a directory: ${projectPath}`, 'projectPath');
  }
}

/**
 * Validate platform names
 */
export function validatePlatforms(platforms: string): void {
  if (!platforms) {
    return; // Allow empty/undefined - will default to 'auto'
  }

  if (typeof platforms !== 'string') {
    throw new ValidationError('Platforms must be a string', 'platforms');
  }

  const validPlatforms = ['cursor', 'claude', 'copilot', 'gemini', 'auto'];
  const platformList = platforms.split(',').map(p => p.trim());
  
  for (const platform of platformList) {
    if (!validPlatforms.includes(platform)) {
      throw new ValidationError(
        `Invalid platform: ${platform}. Valid platforms: ${validPlatforms.join(', ')}`,
        'platforms'
      );
    }
  }
}

/**
 * Sanitize and normalize project path
 */
export function normalizeProjectPath(projectPath: string): string {
  return path.resolve(projectPath);
}

/**
 * Validate boolean parameters
 */
export function validateBoolean(value: any, fieldName: string): boolean {
  if (value === undefined || value === null) {
    return false;
  }
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (typeof value === 'string') {
    const lower = value.toLowerCase();
    if (lower === 'true' || lower === '1' || lower === 'yes') {
      return true;
    }
    if (lower === 'false' || lower === '0' || lower === 'no') {
      return false;
    }
  }
  
  throw new ValidationError(`${fieldName} must be a boolean value`, fieldName);
}

/**
 * Comprehensive input validator for tool parameters
 */
export async function validateToolInput(params: any, schema: any): Promise<void> {
  // Basic type validation against JSON schema
  if (schema.required) {
    for (const required of schema.required) {
      if (!(required in params)) {
        throw new ValidationError(`Missing required field: ${required}`, required);
      }
    }
  }

  // Validate projectPath if present
  if (params.projectPath) {
    params.projectPath = normalizeProjectPath(params.projectPath);
    await validateProjectPath(params.projectPath);
  }

  // Validate platforms if present
  if (params.options?.platforms) {
    validatePlatforms(params.options.platforms);
  }

  // Validate boolean options
  if (params.options) {
    for (const [key, value] of Object.entries(params.options)) {
      if (typeof value === 'boolean' || typeof value === 'string') {
        if (['full', 'dryRun', 'verbose', 'json'].includes(key)) {
          params.options[key] = validateBoolean(value, key);
        }
      }
    }
  }
}

/**
 * Sanitize error messages for safe output
 */
export function sanitizeErrorMessage(error: any): string {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Unknown error occurred';
}