import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { VibeCliWrapper } from '../utils/vibe-wrapper.js';

/**
 * Init tool - Initialize vibe system in project
 */
export class InitTool {
  name = 'init_rules';
  description = 'Initialize the vibe system in a project, creating the vibe/ directory and platform configurations';
  
  inputSchema = {
    type: 'object' as const,
    properties: {
      projectPath: {
        type: 'string',
        description: 'Path to the project root directory where vibe system should be initialized'
      },
      options: {
        type: 'object',
        properties: {
          platforms: {
            type: 'string',
            description: 'Comma-separated list of platforms to configure (cursor,claude,copilot,gemini) or "auto" for all',
            default: 'auto'
          },
          full: {
            type: 'boolean',
            description: 'Perform full setup including removal of original rule files',
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
          platforms?: string;
          full?: boolean;
        };
      };

      // Validate project path
      if (!projectPath || typeof projectPath !== 'string') {
        throw new Error('Project path is required and must be a string');
      }

      const wrapper = new VibeCliWrapper();
      const result = await wrapper.initialize(projectPath, options);

      if (!result.success) {
        throw new Error(result.error || 'Initialization failed');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: result.message,
              initialization: result.data,
              summary: {
                projectPath,
                platforms: options.platforms || 'auto',
                fullSetup: options.full || false,
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