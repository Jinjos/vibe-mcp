#!/usr/bin/env node

import { VibeMCPServer } from './server.js';
import { logger } from './utils/logger.js';
import { VibeCliWrapper } from './utils/vibe-wrapper.js';

/**
 * Check if vibe-cli dependency is properly installed
 */
async function checkDependencies(): Promise<boolean> {
  try {
    const wrapper = new VibeCliWrapper();
    logger.info('✅ vibe-cli dependency check passed');
    return true;
  } catch (error) {
    logger.error('❌ vibe-cli dependency check failed:', error instanceof Error ? error : new Error(String(error)));
    console.error('\n🔧 To fix this issue, install vibe-cli:');
    console.error('   npm install -g @jinjos/vibe-cli');
    console.error('\nOr install it locally in your project:');
    console.error('   npm install @jinjos/vibe-cli\n');
    return false;
  }
}

// Handle command line arguments and start the server
async function main() {
  const args = process.argv.slice(2);
  
  // Handle --check-deps flag for dependency validation
  if (args.includes('--check-deps')) {
    const isValid = await checkDependencies();
    process.exit(isValid ? 0 : 1);
  }
  
  // Validate dependencies before starting server
  const isValid = await checkDependencies();
  if (!isValid) {
    console.error('Cannot start vibe-mcp server due to missing dependencies.');
    process.exit(1);
  }
  
  // Start the MCP server
  const server = new VibeMCPServer();
  server.start().catch((error) => {
    logger.error('Startup failed', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  });
}

// Start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error('Main process failed', error instanceof Error ? error : new Error(String(error)));
    process.exit(1);
  });
}

export { VibeMCPServer };