import { CallToolRequest } from '@modelcontextprotocol/sdk/types.js';
import { VibeCliWrapper } from '../utils/vibe-wrapper.js';
import { validateToolInput, sanitizeErrorMessage } from '../utils/validators.js';
import { logger } from '../utils/logger.js';

/**
 * Analyze tool - Full project analysis with tech stack detection
 */
export class AnalyzeTool {
  name = 'repo_analysis';
  description = 'Perform comprehensive analysis of a project\'s tech stack, AI configurations, and rule coverage';
  
  inputSchema = {
    type: 'object' as const,
    properties: {
      projectPath: {
        type: 'string',
        description: 'Path to the project root directory to analyze'
      },
      options: {
        type: 'object',
        properties: {
          verbose: {
            type: 'boolean', 
            description: 'Include detailed analysis information',
            default: false
          },
        },
        additionalProperties: false
      }
    },
    required: ['projectPath'],
    additionalProperties: false
  };

  async call(request: CallToolRequest): Promise<any> {
    const toolLogger = logger.scope('AnalyzeTool');
    
    try {
      const params = request.params.arguments as {
        projectPath: string;
        options?: {
          verbose?: boolean;
        };
      };

      toolLogger.debug('Validating input parameters', { params });
      await validateToolInput(params, this.inputSchema);

      const { projectPath, options = {} } = params;

      toolLogger.info('Starting project analysis', { projectPath, options });
      
      const wrapper = new VibeCliWrapper();
      const result = await wrapper.analyze(projectPath, options);

      if (!result.success) {
        toolLogger.error('Analysis failed', new Error(result.error || 'Analysis failed'), { projectPath });
        throw new Error(result.error || 'Analysis failed');
      }

      toolLogger.info('Analysis completed successfully', { projectPath });

      // Return the optimized JSON structure directly
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(result.data, null, 2)
          }
        ]
      };

    } catch (error) {
      const errorMessage = sanitizeErrorMessage(error);
      toolLogger.error('Tool execution failed', error instanceof Error ? error : new Error(errorMessage));
      
      return {
        content: [
          {
            type: 'text', 
            text: JSON.stringify({
              error: errorMessage,
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