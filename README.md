# Vibe MCP Server

A Model Context Protocol (MCP) server that provides AI-integrated access to [vibe-cli](https://github.com/jinjos/vibe-cli) for unified AI coding rules management.

## Features

- 📊 **Deep Project Analysis** - Comprehensive tech stack detection and AI configuration analysis
- 🚀 **Rules Management** - Initialize, sync, and manage AI coding standards across platforms
- 📈 **Performance Monitoring** - Real-time status and health checks for all AI platforms
- 🤖 **AI-Optimized Output** - Structured JSON responses designed for AI consumption

## Demo

### Repository Analysis with Vibe
[![Vibe Analysis and Rules](https://img.youtube.com/vi/MWqZc-JK8VM/0.jpg)](https://youtu.be/MWqZc-JK8VM)

*See how AI assistants analyze projects and manage unified coding standards*

## Installation

### One-Click Install

#### VS Code
[![Install in VS Code](https://img.shields.io/badge/Install-VS%20Code-blue?style=for-the-badge)](vscode:extension/jinjos.vibe-mcp)

#### VS Code Insiders  
[![Install in VS Code Insiders](https://img.shields.io/badge/Install-VS%20Code%20Insiders-green?style=for-the-badge)](vscode-insiders:extension/jinjos.vibe-mcp)

### Claude Desktop Configuration

Add to your Claude Desktop config:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

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

### Cursor/VS Code with MCP

```json
{
  "mcpServers": {
    "vibe": {
      "command": "npx", 
      "args": ["-y", "@jinjos/vibe-mcp"]
    }
  }
}
```

## Available Tools

### `repo_analysis`
Performs deep analysis of project tech stack, AI configurations, and rule coverage.

```json
{
  "projectPath": "/path/to/project",
  "options": {
    "verbose": true
  }
}
```

Returns AI-optimized JSON with:
- Project metadata and tech stack breakdown
- AI platform configuration status  
- Coverage score with detailed analysis
- Gap analysis with actionable recommendations
- MCP server recommendations based on actual tech stack

### `init_rules`
Sets up unified AI rules system with platform configurations.

```json
{
  "projectPath": "/path/to/project",
  "options": {
    "platforms": "cursor,claude,copilot,gemini",
    "full": false
  }
}
```

### `sync_rules`
Syncs rules from platform directories to unified vibe/ system.

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

### `vibe_status`
Comprehensive status of vibe system including performance metrics.

```json
{
  "projectPath": "/path/to/project",
  "options": {
    "verbose": true
  }
}
```

## Requirements

- Node.js 18.0.0 or higher
- An MCP-compatible client (Claude Desktop, VS Code, Cursor, etc.)

## Architecture

```
AI Agent ↔ MCP Protocol ↔ Vibe MCP Server ↔ vibe-cli
```

The MCP server provides:
- Clean JSON output without emojis or formatting
- Structured data optimized for AI consumption  
- Direct integration with vibe-cli functionality
- Performance metrics and health monitoring

## Configuration

### Environment Variables

- `VIBE_LOG_LEVEL`: Logging level (0=ERROR, 1=WARN, 2=INFO, 3=DEBUG)

### Debugging

Enable debug logging:
```bash
VIBE_LOG_LEVEL=3 npx -y @jinjos/vibe-mcp
```

## Troubleshooting

### Tool not found errors
```bash
npm run build  # Ensure server is built
```

### MCP connection issues
```bash
# Enable debug logging
VIBE_LOG_LEVEL=3 node dist/index.js
```

### Performance monitoring
The server maintains:
- Memory usage <100MB baseline
- Response time <2 seconds for most operations
- No background processes

## Related Projects

- [vibe-cli](https://github.com/jinjos/vibe-cli) - Universal AI rules CLI
- [Model Context Protocol](https://modelcontextprotocol.io/) - MCP specification
- [MCP Servers](https://github.com/modelcontextprotocol/servers) - Official MCP server registry

## License

MIT - Same as [vibe-cli](https://github.com/jinjos/vibe-cli)

---

**🤖 Bring your AI tools into perfect harmony 🤖**
