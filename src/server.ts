import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';

// Import tools
import { AnalyzeTool } from './tools/analyze.js';
import { InitTool } from './tools/init.js';
import { SyncTool } from './tools/sync.js';
import { StatusTool } from './tools/status.js';

// Import utilities
import { logger } from './utils/logger.js';

/**
 * Vibe MCP Server - Model Context Protocol server for vibe-cli
 * 
 * Provides AI-integrated access to vibe-cli functionality:
 * - Project analysis with tech stack detection
 * - Vibe system initialization  
 * - Rule synchronization between platforms
 * - System status and performance monitoring
 */
export class VibeMCPServer {
  private server: Server;
  private tools: Map<string, any>;

  constructor() {
    this.server = new Server(
      {
        name: 'vibe-mcp',
        version: '1.0.0'
      },
      {
        capabilities: {
          tools: {}
        }
      }
    );

    this.tools = new Map();
    this.registerTools();
    this.setupHandlers();
  }

  /**
   * Register all available tools
   */
  private registerTools(): void {
    const tools = [
      new AnalyzeTool(),
      new InitTool(),
      new SyncTool(),
      new StatusTool()
    ];

    for (const tool of tools) {
      this.tools.set(tool.name, tool);
    }

    logger.info(`Registered ${tools.length} tools`, { tools: tools.map(t => t.name) });
  }

  /**
   * Set up MCP request handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const toolList = Array.from(this.tools.values()).map(tool => ({
        name: tool.name,
        description: tool.description,
        inputSchema: tool.inputSchema
      }));

      logger.debug(`Listed ${toolList.length} tools`);
      
      return {
        tools: toolList
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name } = request.params;
      
      logger.info(`Tool call initiated: ${name}`);
      
      const tool = this.tools.get(name);
      if (!tool) {
        const error = new Error(`Tool not found: ${name}`);
        logger.error('Tool not found', error, { requestedTool: name, availableTools: Array.from(this.tools.keys()) });
        throw error;
      }

      try {
        const result = await tool.call(request);
        logger.info(`Tool completed successfully: ${name}`);
        return result;
      } catch (error) {
        logger.error(`Tool failed: ${name}`, error instanceof Error ? error : new Error(String(error)));
        throw error;
      }
    });

    // Error handling
    this.server.onerror = (error) => {
      logger.error('Server error occurred', error instanceof Error ? error : new Error(String(error)));
    };

    process.on('SIGINT', async () => {
      logger.info('Shutting down server...');
      await this.server.close();
      process.exit(0);
    });
  }

  /**
   * Start the MCP server
   */
  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    
    logger.info('Starting Vibe MCP Server');
    logger.debug('Using StdioServerTransport');
    
    try {
      await this.server.connect(transport);
      logger.info('Server started successfully');
    } catch (error) {
      logger.error('Failed to start server', error instanceof Error ? error : new Error(String(error)));
      process.exit(1);
    }
  }
}