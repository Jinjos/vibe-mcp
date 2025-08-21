import { createRequire } from 'module';
import path from 'path';
import fs from 'fs';

// Create a require function for importing CommonJS modules
const require = createRequire(import.meta.url);

/**
 * Wrapper utility for integrating with vibe-cli CommonJS modules
 * Provides typed interfaces and error handling for MCP server
 */
export class VibeCliWrapper {
  private vibeLibPath: string;
  private vibeCliVersion: string | null = null;

  constructor() {
    this.vibeLibPath = this.findVibeCliPath();
  }

  /**
   * Find vibe-cli installation path using direct package resolution
   */
  private findVibeCliPath(): string {
    try {
      // Direct package resolution - vibe-cli is now bundled as a dependency
      const packagePath = require.resolve('@jinjos/vibe-cli/package.json');
      const libPath = path.join(path.dirname(packagePath), 'lib');
      
      if (fs.existsSync(libPath)) {
        this.vibeCliVersion = this.getPackageVersion(packagePath);
        return libPath;
      } else {
        throw new Error(`vibe-cli lib directory not found at: ${libPath}`);
      }
    } catch (error) {
      throw new Error(
        'vibe-cli not found. This should not happen as @jinjos/vibe-cli is bundled as a dependency.\n' +
        'Please reinstall @jinjos/vibe-mcp to fix this issue.'
      );
    }
  }

  /**
   * Get package version from package.json
   */
  private getPackageVersion(packageJsonPath: string): string | null {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return packageJson.version || null;
    } catch {
      return null;
    }
  }

  /**
   * Validate vibe-cli installation and version compatibility
   */
  private validateVibeCliInstallation(): void {
    if (!fs.existsSync(this.vibeLibPath)) {
      throw new Error(`vibe-cli lib directory not found at: ${this.vibeLibPath}`);
    }

    // Check for required modules
    const requiredModules = ['init.js', 'status.js', 'platform-detector.js'];
    const missingModules = requiredModules.filter(module => 
      !fs.existsSync(path.join(this.vibeLibPath, module))
    );

    if (missingModules.length > 0) {
      throw new Error(
        `Missing vibe-cli modules: ${missingModules.join(', ')}\n` +
        'Please reinstall @jinjos/vibe-mcp'
      );
    }

    if (this.vibeCliVersion) {
      // Check version compatibility (require 1.0.0+)
      const [major] = this.vibeCliVersion.split('.').map(Number);
      if (major < 1) {
        throw new Error(
          `Incompatible vibe-cli version: ${this.vibeCliVersion}. ` +
          'Please upgrade to version 1.0.0 or higher.'
        );
      }
    }
  }

  /**
   * Initialize vibe system in a project
   */
  async initialize(projectPath: string, options: InitOptions = {}): Promise<InitResult> {
    try {
      this.validateVibeCliInstallation();
      const { initializeVibeSystem } = require(path.join(this.vibeLibPath, 'init.js'));
      const result = await initializeVibeSystem(projectPath, { ...options, mcpMode: true });
      
      return {
        success: true,
        data: result,
        message: 'Vibe system initialized successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to initialize vibe system'
      };
    }
  }

  /**
   * Analyze repository with full tech stack detection
   */
  async analyze(projectPath: string, options: AnalyzeOptions = {}): Promise<AnalyzeResult> {
    try {
      this.validateVibeCliInstallation();
      const { analyzeRepository } = require(path.join(this.vibeLibPath, 'analyzer/index.js'));
      // Always use mcpMode for MCP calls to get optimized JSON structure
      const result = await analyzeRepository(projectPath, { ...options, mcpMode: true });
      
      return {
        success: true,
        data: result,
        message: 'Analysis completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to analyze repository'
      };
    }
  }

  /**
   * Sync rules between platforms
   */
  async sync(projectPath: string, options: SyncOptions = {}): Promise<SyncResult> {
    try {
      this.validateVibeCliInstallation();
      
      // Check if sync.js exists, fallback to rule-migrator if not
      const syncPath = path.join(this.vibeLibPath, 'sync.js');
      
      if (fs.existsSync(syncPath)) {
        const { syncVibeSystem } = require(syncPath);
        const result = await syncVibeSystem(projectPath, { ...options, mcpMode: true });
        
        return {
          success: true,
          data: result,
          message: 'Sync completed successfully'
        };
      } else {
        // Fallback: Use rule-migrator and config-generator for basic sync functionality
        const { migrateExistingRules } = require(path.join(this.vibeLibPath, 'rule-migrator.js'));
        const { generatePlatformConfigs } = require(path.join(this.vibeLibPath, 'config-generator.js'));
        const { detectPlatforms } = require(path.join(this.vibeLibPath, 'platform-detector.js'));
        
        const vibeDir = path.join(projectPath, 'vibe');
        const detection = await detectPlatforms(projectPath);
        
        // Basic sync using available modules
        const result = {
          migrated: await migrateExistingRules(projectPath, vibeDir, detection.rules || []),
          generated: await generatePlatformConfigs(projectPath, detection.platforms || [], { ...options, mcpMode: true })
        };
        
        return {
          success: true,
          data: result,
          message: 'Sync completed using fallback method (sync.js not available in this vibe-cli version)'
        };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to sync vibe system'
      };
    }
  }

  /**
   * Get system status and performance metrics
   */
  async getStatus(projectPath: string, options: StatusOptions = {}): Promise<StatusResult> {
    try {
      this.validateVibeCliInstallation();
      const { showStatus, analyzeVibeRules, detectRuleIssues, PLATFORM_LIMITS } = require(path.join(this.vibeLibPath, 'status.js'));
      const { detectPlatforms } = require(path.join(this.vibeLibPath, 'platform-detector.js'));
      
      // Capture console output for structured data
      const originalLog = console.log;
      const logs: string[] = [];
      console.log = (...args: any[]) => {
        logs.push(args.join(' '));
      };
      
      try {
        await showStatus(projectPath, { ...options, mcpMode: true });
      } finally {
        console.log = originalLog;
      }

      // Get structured data for API response
      const vibeDir = path.join(projectPath, 'vibe');
      const detection = await detectPlatforms(projectPath);
      const vibeRules = await analyzeVibeRules(vibeDir);
      const issues = await detectRuleIssues(vibeRules);

      return {
        success: true,
        data: {
          platforms: detection.platforms,
          rules: vibeRules,
          issues: issues,
          platformLimits: PLATFORM_LIMITS,
          consoleOutput: logs.join('\n')
        },
        message: 'Status retrieved successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to get system status'
      };
    }
  }

  /**
   * Auto-fix configuration issues
   */
  async fix(projectPath: string, options: FixOptions = {}): Promise<FixResult> {
    try {
      this.validateVibeCliInstallation();
      const { autoFixRules } = require(path.join(this.vibeLibPath, 'fix.js'));
      const result = await autoFixRules(projectPath, { ...options, mcpMode: true });
      
      return {
        success: true,
        data: result,
        message: 'Configuration issues fixed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to fix configuration issues'
      };
    }
  }

  /**
   * Detect platforms and configurations
   */
  async detectPlatforms(projectPath: string): Promise<DetectionResult> {
    try {
      this.validateVibeCliInstallation();
      const { detectPlatforms } = require(path.join(this.vibeLibPath, 'platform-detector.js'));
      const result = await detectPlatforms(projectPath);
      
      return {
        success: true,
        data: result,
        message: 'Platform detection completed successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: 'Failed to detect platforms'
      };
    }
  }
}

// Type definitions for better TypeScript support
export interface InitOptions {
  platforms?: string;
  full?: boolean;
}

export interface InitResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

export interface AnalyzeOptions {
  verbose?: boolean;
  mcpMode?: boolean;
}

export interface AnalyzeResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

export interface SyncOptions {
  full?: boolean;
  platforms?: string;
  dryRun?: boolean;
}

export interface SyncResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

export interface StatusOptions {
  verbose?: boolean;
}

export interface StatusResult {
  success: boolean;
  data?: {
    platforms: string[];
    rules: any[];
    issues: any[];
    platformLimits: any;
    consoleOutput: string;
  };
  error?: string;
  message: string;
}

export interface FixOptions {
  force?: boolean;
}

export interface FixResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}

export interface DetectionResult {
  success: boolean;
  data?: any;
  error?: string;
  message: string;
}