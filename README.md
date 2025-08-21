# Vibe MCP Server 🤖

> **AI-integrated access to universal AI coding rules management**

A Model Context Protocol (MCP) server for [vibe-cli](https://github.com/jinjos/vibe-cli), providing seamless AI-integrated access to unified AI coding rules management across Claude Code, Cursor, GitHub Copilot, and Gemini CLI.

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0.0 or higher

### Installation & Setup

**Option 1: One-Command Setup (Recommended)**
```json
{
  "mcpServers": {
    "vibe": {
      "command": "npx",
      "args": ["-y", "@jinjos/vibe-mcp"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

**Option 2: Global Installation**
```bash
npm install -g @jinjos/vibe-mcp
```

### Client-Specific Configuration

**Claude Desktop:**
- **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "vibe": {
      "command": "npx",
      "args": ["-y", "@jinjos/vibe-mcp"],
      "cwd": "/path/to/your/project"
    }
  }
}
```

**Workspace-Aware Clients (VS Code, Cursor):**
```json
{
  "command": "npx",
  "args": ["-y", "@jinjos/vibe-mcp"]
}
```

## 🛠️ Available Tools

### `repo_analysis` - Comprehensive Repository Analysis
Performs deep analysis of project tech stack, AI configurations, and rule coverage.

**Returns optimized JSON structure perfect for AI consumption:**
- 📊 Project metadata and tech stack breakdown
- 🤖 AI platform configuration status
- 📈 Coverage score with detailed breakdown  
- 🔍 Gap analysis with actionable recommendations
- 🔧 MCP server recommendations based on actual tech stack
- 💡 Strategic insights and next steps

**Parameters:**
```json
{
  "projectPath": "/path/to/project",
  "options": {
    "verbose": true
  }
}
```

### `init_rules` - Initialize Vibe System
Sets up unified AI rules system with platform configurations.

**Parameters:**
```json
{
  "projectPath": "/path/to/project",
  "options": {
    "platforms": "cursor,claude,copilot,gemini",
    "full": false
  }
}
```

### `sync_rules` - Synchronize Rules
Syncs rules from platform directories to unified vibe/ system.

**Parameters:**
```json
{
  "projectPath": "/path/to/project",
  "options": {
    "platforms": "auto",
    "full": false,
    "dryRun": true
  }
}
```

### `status` - System Status
Comprehensive status of vibe system including performance metrics.

**Parameters:**
```json
{
  "projectPath": "/path/to/project",
  "options": {
    "verbose": true
  }
}
```

## 🎯 Key Features

### **🤖 AI-First Design**
- **Clean JSON Output**: No emojis, colors, or parsing errors
- **Optimized Structure**: Data formatted specifically for AI consumption
- **Rich Context**: Provides comprehensive project insights to AI agents
- **Actionable Intelligence**: Returns specific recommendations, not just data

### **⚡ Zero Configuration**
- **Auto-Discovery**: Automatically bundles vibe-cli dependency
- **Smart Defaults**: Works out of the box with intelligent configuration
- **Universal Compatibility**: Works with any MCP-compatible client
- **Hot Integration**: No separate CLI installation needed

### **🔧 Developer Experience**
- **Real-time Monitoring**: Live performance metrics and health status
- **Context-Aware**: AI understands your project structure deeply
- **No Context Switching**: Manage rules without leaving development environment
- **Comprehensive Analysis**: Get insights you can't get from CLI alone

## 🏗️ Architecture

### MCP Integration Pattern
```
AI Agent ↔ MCP Protocol ↔ Vibe MCP Server ↔ vibe-cli modules
```

**Key Design Decisions:**
- **Clean Separation**: CLI gets formatted output, MCP gets structured JSON
- **mcpMode Flag**: Suppresses console output and spinners for clean API responses
- **Direct Integration**: Bundles vibe-cli as dependency for seamless operation
- **Performance Optimized**: <100MB memory footprint, <2s response times

### JSON Output Structure
The MCP server returns AI-optimized JSON with clear hierarchy:

```json
{
  "analysis": {
    "metadata": { "projectPath": "...", "timestamp": "..." },
    "project": { "name": "...", "techStack": {...} },
    "aiConfiguration": { "platforms": {...}, "vibeSystem": {...} },
    "coverage": { "score": 82, "breakdown": {...} },
    "gaps": { "uncoveredTechnologies": [...] },
    "recommendations": { "immediate": [...], "mcpServers": [...] },
    "insights": { "strengths": [...], "weaknesses": [...], "nextSteps": [...] }
  }
}
```

## 🔧 Development

### Project Structure
```
vibe-mcp/
├── src/
│   ├── index.ts              # MCP server entry point
│   ├── server.ts             # MCP protocol implementation
│   ├── tools/                # MCP tool implementations
│   │   ├── analyze.ts        # repo_analysis tool
│   │   ├── init.ts           # init_rules tool
│   │   ├── sync.ts           # sync_rules tool
│   │   └── status.ts         # status tool
│   └── utils/                # Shared utilities
│       ├── vibe-wrapper.ts   # vibe-cli integration wrapper
│       ├── logger.ts         # Structured logging system
│       └── validators.ts     # Input validation
├── dist/                     # Compiled output
└── package.json
```

### Commands
```bash
# Development
npm run dev          # Watch mode compilation
npm run build        # Production build
npm start           # Start MCP server

# Testing
npm test            # Run test suite
npm run verify      # Build verification

# Maintenance
npm run clean       # Remove build artifacts
```

### Environment Variables
- `VIBE_LOG_LEVEL`: Logging level (0=ERROR, 1=WARN, 2=INFO, 3=DEBUG)

## 🚨 Troubleshooting

### Common Issues

**"Tool not found" errors:**
```bash
npm run build  # Ensure server is built
```

**MCP connection issues:**
```bash
# Enable debug logging
VIBE_LOG_LEVEL=3 node dist/index.js
```

**vibe-cli integration failures:**
```bash
npm install  # Reinstall to fix dependency issues
```

### Debug Mode
```bash
VIBE_LOG_LEVEL=3 vibe-mcp
```

## 📊 Performance

- **Memory**: <100MB baseline
- **Response Time**: <2 seconds for most operations  
- **No Background Processes**: Stateless operation
- **Efficient Integration**: Direct module access, no CLI spawning

## 🤝 Integration Benefits

**For AI Agents:**
- Deep project understanding through comprehensive analysis
- Clean, structured data without parsing issues
- Actionable recommendations based on actual tech stack
- Real-time status monitoring and health checks

**For Developers:**
- Seamless rules management without context switching
- AI-assisted project analysis and optimization
- Automated gap detection and recommendations
- Performance monitoring across all AI platforms

## 📄 License

MIT - Same as [vibe-cli](https://github.com/jinjos/vibe-cli)

## 🔗 Related

- [vibe-cli](https://github.com/jinjos/vibe-cli) - Universal AI rules CLI
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Official MCP server registry

---

<div align="center">

**🤖 Bring your AI tools into perfect harmony 🤖**

[**Get Started**](#quick-start) • [**Documentation**](https://github.com/jinjos/vibe-cli) • [**MCP Protocol**](https://modelcontextprotocol.io/)

</div>