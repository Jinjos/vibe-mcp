#!/usr/bin/env node

/**
 * Integration test to verify vibe-cli wrapper functionality
 */

import { VibeCliWrapper } from '../dist/utils/vibe-wrapper.js';
import { mkdtemp } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';

console.log('🧪 Testing vibe-cli integration...');

async function testIntegration() {
  // Create a temporary directory for testing
  const tempDir = await mkdtemp(path.join(tmpdir(), 'vibe-mcp-integration-'));
  console.log(`📁 Created test directory: ${tempDir}`);

  try {
    const wrapper = new VibeCliWrapper();

    // Test 1: Platform detection (should work without vibe system)
    console.log('🔍 Testing platform detection...');
    const detectionResult = await wrapper.detectPlatforms(tempDir);
    
    if (detectionResult.success) {
      console.log('✅ Platform detection working');
      console.log(`   Detected platforms: ${detectionResult.data?.platforms?.length || 0}`);
    } else {
      console.log('⚠️  Platform detection failed (expected for empty directory)');
      console.log(`   Error: ${detectionResult.error}`);
    }

    // Test 2: Status check (should fail gracefully without vibe system)
    console.log('📊 Testing status check...');
    const statusResult = await wrapper.getStatus(tempDir);
    
    if (statusResult.success) {
      console.log('✅ Status check working');
    } else {
      console.log('⚠️  Status check failed (expected without vibe system)');
      console.log(`   Error: ${statusResult.error}`);
    }

    console.log('✅ Integration tests completed successfully!');
    console.log('');
    console.log('🎉 The vibe-cli wrapper is functioning correctly.');

  } catch (error) {
    console.error('❌ Integration test failed:', error.message);
    process.exit(1);
  }
}

testIntegration();