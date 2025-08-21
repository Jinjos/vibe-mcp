#!/usr/bin/env node

/**
 * Simple verification script to ensure the MCP server builds and loads correctly
 */

import { VibeMCPServer } from '../dist/index.js';

console.log('🔍 Verifying Vibe MCP Server build...');

try {
  // Test that we can create a server instance
  const server = new VibeMCPServer();
  console.log('✅ Server instance created successfully');

  // Test that the server has the expected properties
  if (typeof server.start === 'function') {
    console.log('✅ Server has start method');
  } else {
    throw new Error('Server missing start method');
  }

  console.log('✅ All build verification tests passed!');
  console.log('');
  console.log('🚀 The MCP server is ready for use.');
  console.log('');
  console.log('Next steps:');
  console.log('1. Configure your MCP client (e.g., Claude Desktop)');
  console.log('2. Point it to:', new URL('../dist/index.js', import.meta.url).pathname);
  console.log('3. Start using the vibe tools in your AI conversations!');
  
} catch (error) {
  console.error('❌ Build verification failed:', error.message);
  process.exit(1);
}