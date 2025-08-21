import { validateProjectPath, validatePlatforms, normalizeProjectPath, ValidationError } from '../validators';
import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

describe('Validators', () => {
  let tempDir: string;

  beforeEach(async () => {
    tempDir = await mkdtemp(path.join(tmpdir(), 'vibe-mcp-test-'));
  });

  afterEach(async () => {
    if (tempDir) {
      await rm(tempDir, { recursive: true, force: true });
    }
  });

  describe('validateProjectPath', () => {
    it('should validate existing directory', async () => {
      await expect(validateProjectPath(tempDir)).resolves.not.toThrow();
    });

    it('should reject non-existent path', async () => {
      const nonExistentPath = path.join(tempDir, 'does-not-exist');
      await expect(validateProjectPath(nonExistentPath)).rejects.toThrow(ValidationError);
    });

    it('should reject empty path', async () => {
      await expect(validateProjectPath('')).rejects.toThrow(ValidationError);
    });

    it('should reject non-string path', async () => {
      // @ts-expect-error Testing invalid input
      await expect(validateProjectPath(123)).rejects.toThrow(ValidationError);
    });
  });

  describe('validatePlatforms', () => {
    it('should accept valid platforms', () => {
      expect(() => validatePlatforms('cursor,claude')).not.toThrow();
      expect(() => validatePlatforms('auto')).not.toThrow();
      expect(() => validatePlatforms('')).not.toThrow();
    });

    it('should reject invalid platforms', () => {
      expect(() => validatePlatforms('invalid,platform')).toThrow(ValidationError);
      expect(() => validatePlatforms('cursor,invalid')).toThrow(ValidationError);
    });

    it('should handle single platform', () => {
      expect(() => validatePlatforms('cursor')).not.toThrow();
    });
  });

  describe('normalizeProjectPath', () => {
    it('should resolve relative paths', () => {
      const result = normalizeProjectPath('./test');
      expect(path.isAbsolute(result)).toBe(true);
    });

    it('should return absolute paths unchanged', () => {
      const absolutePath = '/absolute/path';
      expect(normalizeProjectPath(absolutePath)).toBe(absolutePath);
    });
  });
});