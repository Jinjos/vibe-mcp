import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { VibeCliWrapper } from '../utils/vibe-wrapper.js';

/**
 * Status tool - Show system status and performance metrics
 */
export class StatusTool {
  name = 'vibe_status';
  description = 'Get comprehensive status of the vibe system including platform configurations, rule analysis, and performance metrics';
  
  inputSchema = {
    type: 'object' as const,
    properties: {
      projectPath: {
        type: 'string',
        description: 'Path to the project root directory to check status for'
      },
      options: {
        type: 'object',
        properties: {
          verbose: {
            type: 'boolean',
            description: 'Include detailed analysis and performance metrics',
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
          verbose?: boolean;
        };
      };

      // Validate project path
      if (!projectPath || typeof projectPath !== 'string') {
        throw new Error('Project path is required and must be a string');
      }

      const wrapper = new VibeCliWrapper();
      const result = await wrapper.getStatus(projectPath, options);

      if (!result.success) {
        throw new Error(result.error || 'Status check failed');
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              message: result.message,
              status: result.data,
              summary: {
                projectPath,
                verbose: options.verbose || false,
                platformsConfigured: result.data?.platforms?.length || 0,
                totalRules: result.data?.rules?.length || 0,
                issuesFound: result.data?.issues?.length || 0,
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