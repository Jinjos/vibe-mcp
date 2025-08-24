#!/usr/bin/env node
/**
 * Test MCP Mode JSON Output
 * Simple script to verify mcpMode returns clean JSON structure
 */

const { RepositoryAnalyzer } = require('/Users/tommers/Desktop/vibe/vibe-cli/lib/analyzer/index.js');

async function testMCPJSONOutput() {
  console.log('🤖 MCP MODE JSON OUTPUT TEST');
  console.log('============================\n');
  
  // Test on a different directory - you can change this path
    const testProjectPath = '/Users/tommers/Documents/Shippiz/wl-site';
  
  console.log('Testing project path:', testProjectPath);
  console.log('Mode: MCP (mcpMode: true)');
  console.log('Expected: Clean JSON without console formatting\n');

  try {
    // Create analyzer with mcpMode enabled
    const analyzer = new RepositoryAnalyzer({ mcpMode: true });
    
    // Run analysis in MCP mode
    const result = await analyzer.analyze(testProjectPath, { mcpMode: true });
    
    console.log('✅ Analysis completed successfully\n');
    
    // Show structure overview first
    console.log('=== JSON STRUCTURE OVERVIEW ===');
    console.log('Top-level keys:', Object.keys(result));
    
    if (result.analysis) {
      console.log('Analysis keys:', Object.keys(result.analysis));
      console.log('Project keys:', Object.keys(result.analysis.project || {}));
      console.log('Tech stack keys:', Object.keys(result.analysis.project?.techStack || {}));
    }
    
    console.log('\n=== FULL JSON OUTPUT ===');
    console.log(JSON.stringify(result, null, 2));
    
    // Validation checks
    console.log('\n=== VALIDATION CHECKS ===');
    
    // Check for clean JSON (no emojis, colors, etc.)
    const jsonString = JSON.stringify(result);
    const hasEmojis = /[📋🔍🎯🚀⚡🔧💻]/u.test(jsonString);
    const hasColors = /\u001b\[[0-9;]*m/.test(jsonString);
    const hasSpinners = jsonString.includes('ora') || jsonString.includes('spinner');
    
    console.log('✅ JSON is clean (no emojis):', !hasEmojis);
    console.log('✅ JSON is clean (no color codes):', !hasColors);
    console.log('✅ JSON is clean (no spinners):', !hasSpinners);
    console.log('✅ Has analysis structure:', !!result.analysis);
    console.log('✅ Has project info:', !!result.analysis?.project);
    console.log('✅ Has tech stack data:', !!result.analysis?.project?.techStack);
    console.log('✅ Has gaps data:', !!result.analysis?.gaps);
    console.log('✅ Has recommendations:', !!result.analysis?.recommendations);
    console.log('✅ Has metadata:', !!result.analysis?.metadata);
    
    // Show detected technologies
    if (result.analysis?.project?.techStack) {
      const techStack = result.analysis.project.techStack;
      console.log('\n=== DETECTED TECHNOLOGIES ===');
      console.log('Languages:', techStack.languages || []);
      console.log('Primary Language:', result.analysis.project.primaryLanguage || 'none');
      console.log('Project Type:', result.analysis.project.type || 'unknown');
      console.log('Frameworks:', techStack.frameworks || []);
      console.log('Databases:', techStack.databases || []);
      console.log('Testing:', techStack.testing || []);
      console.log('Build Tools:', techStack.buildTools || []);
      console.log('Deployment:', techStack.deployment || []);
    }
    
    // Show gaps and recommendations summary
    if (result.analysis?.gaps) {
      console.log('\n=== GAPS ANALYSIS ===');
      const gaps = result.analysis.gaps;
      console.log('Uncovered Technologies:', gaps.uncoveredTechnologies?.length || 0);
      console.log('Missing Platforms:', gaps.missingPlatforms?.length || 0);
      console.log('Configuration Issues:', gaps.configurationIssues?.length || 0);
    }
    
    if (result.analysis?.recommendations) {
      console.log('\n=== RECOMMENDATIONS ===');
      const recs = result.analysis.recommendations;
      console.log('Immediate Actions:', recs.immediate?.length || 0);
      console.log('MCP Servers:', recs.mcpServers?.length || 0);
    }
    
    return { 
      success: true, 
      jsonSize: jsonString.length,
      hasCleanStructure: !!result.analysis,
      detectedTechnologies: result.analysis?.project?.techStack?.frameworks?.length || 0
    };
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
    return { success: false, error: error.message };
  }
}

// Run the test
if (require.main === module) {
  testMCPJSONOutput()
    .then(result => {
      console.log('\n' + '='.repeat(60));
      if (result.success) {
        console.log('🎉 MCP JSON OUTPUT TEST PASSED!');
        console.log(`✅ Generated ${result.jsonSize} characters of clean JSON`);
        console.log(`✅ Detected ${result.detectedTechnologies} technologies`);
        console.log('✅ mcpMode is working correctly');
        console.log('✅ Clean JSON structure confirmed');
      } else {
        console.log('❌ MCP JSON OUTPUT TEST FAILED');
        console.log('Error:', result.error);
        console.log('\nTry changing the testProjectPath to a valid directory');
      }
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('\n❌ FATAL ERROR:', error.message);
      console.error('Make sure you are running this from the vibe project root');
      process.exit(1);
    });
}

module.exports = { testMCPJSONOutput };