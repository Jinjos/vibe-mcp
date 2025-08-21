import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { VibeCliWrapper } from '../utils/vibe-wrapper.js';

/**
 * Sync tool - Sync rules between platforms  
 */
export class SyncTool {
  name = 'sync_rules';
  description = 'Sync rules from platform directories (Cursor, Copilot, etc.) to the unified vibe/ directory';
  
  inputSchema = {
    type: 'object' as const,
    properties: {
      projectPath: {
        type: 'string',
        description: 'Path to the project root directory where sync should be performed'
      },
      options: {
        type: 'object',
        properties: {
          full: {
            type: 'boolean',
            description: 'Move rules and delete original files after sync',
            default: false
          },
          platforms: {
            type: 'string',
            description: 'Comma-separated list of platforms to sync (cursor,copilot,claude) or "auto" for all',
            default: 'auto'
          },
          dryRun: {
            type: 'boolean',
            description: 'Show what would be synced without making changes',
            default: false
          }
        },
        additionalProperties: false
      }
    },
    required: ['projectPath'],
    additionalProperties: false
  };

  async call(request: CallToolRequest): Promise<any> {
    try {
      const { projectPath, options = {} } = request.params.arguments as {
        projectPath: string;
        options?: {
          full?: boolean;
          platforms?: string;
          dryRun?: boolean;
        };
      };

      // Validate project path
      if (!projectPath || typeof projectPath !== 'string') {
        throw new Error('Project path is required and must be a string');
      }

      const wrapper = new VibeCliWrapper();
      const result = await wrapper.sync(projectPath, options);

      if (!result.success) {
        throw new Error(result.error || 'Sync failed');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: result.message,
              syncResult: result.data,
              summary: {
                projectPath,
                platforms: options.platforms || 'auto',
                fullSync: options.full || false,
                dryRun: options.dryRun || false,
                newRules: result.data?.newRules || 0,
                overwrittenRules: result.data?.overwrittenRules || 0,
                timestamp: new Date().toISOString(),
                success: true
              }
            }, null, 2)
          }
        ]
      };

    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              error: error instanceof Error ? error.message : 'Unknown error',
              success: false,
              timestamp: new Date().toISOString()
            }, null, 2)
          }
        ],
        isError: true
      };
    }
  }
}