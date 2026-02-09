# ZiweiAI MCP Server

[![npm](https://img.shields.io/npm/v/ziweiai-mcp-server.svg)](https://www.npmjs.com/package/ziweiai-mcp-server)

**中文说明见 [README.zh-CN.md](README.zh-CN.md)。**

MCP (Model Context Protocol) server for ZiweiAI reports. Use it in Cursor, Claude Desktop, or other MCP clients to list your reports, get polished report content, and get payment links.

**Repository:** [https://github.com/Timmy9527/agentziwei](https://github.com/Timmy9527/agentziwei)

## Installation

**Option A – use the published npm package (recommended):**

```bash
npm install ziweiai-mcp-server
```

Or run directly without installing (requires Node.js ≥18):

```bash
npx ziweiai-mcp-server
```

**Option B – build from source (clone the repo):**

```bash
cd mcp-server
npm install
npm run build
```

## Prerequisites

1. **MCP API Key**: Log in at [ziweai.com](https://ziweai.com) or [ziweiai.com.cn](https://ziweiai.com.cn), go to **My Reports**, find **MCP Integration**, and click **Generate MCP API Key**. Copy the key (it is shown only once).
2. **Reports**: Purchase reports on the website first; MCP can only list purchased reports and fetch their content.

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `ZIWEIAI_MCP_API_KEY` | Yes | Your MCP API key from the website. |
| `ZIWEIAI_API_BASE` | No | API base URL (default: `https://ziweai.com`). |

## Run

**If you installed via npm:**

```bash
export ZIWEIAI_MCP_API_KEY="your-key-here"
npx ziweiai-mcp-server
```

Or with the global bin (after `npm install -g ziweiai-mcp-server`):

```bash
export ZIWEIAI_MCP_API_KEY="your-key-here"
ziweiai-mcp
```

**If you built from source:**

```bash
export ZIWEIAI_MCP_API_KEY="your-key-here"
node dist/index.js
```

Or with `tsx` (no build): `ZIWEIAI_MCP_API_KEY="your-key" npx tsx src/index.ts`

## Cursor configuration

Add to Cursor MCP settings (e.g. `~/.cursor/mcp.json` or **Cursor Settings → Features → MCP**):

**Using the npm package (recommended):**

```json
{
  "mcpServers": {
    "ziweiai": {
      "command": "npx",
      "args": ["-y", "ziweiai-mcp-server"],
      "env": {
        "ZIWEIAI_MCP_API_KEY": "your-mcp-api-key"
      }
    }
  }
}
```

`-y` makes npx use the package without prompting. Replace `your-mcp-api-key` with your key.

**Using a local build (clone the repo first):**

```json
{
  "mcpServers": {
    "ziweiai": {
      "command": "node",
      "args": ["/path/to/ziweiai/mcp-server/dist/index.js"],
      "env": {
        "ZIWEIAI_MCP_API_KEY": "your-mcp-api-key"
      }
    }
  }
}
```

Replace `/path/to/ziweiai` with the real path.

## Tools

- **list_my_reports** – List your purchased reports (consumer list).
- **list_report_types** – List report type codes (ming, ln, lc, ll, lr, cp, dh).
- **get_report_content** – Get polished report content (pass generate params + `language`).
- **get_payment_link** – Get URL to purchase a report on the website (query param: `paper`).

### List reports API (GET/POST /api/mcp/reports)

- **Auth**: Header `X-MCP-API-Key` with your MCP API Key.
- **Query params** (optional): `format=human` (return human-readable fields), `lang=zh` or `lang=en` (default `en` when format=human). Without `format`, the API returns the raw array.
- **When format=human**, each item includes `reportType`, `queryInfo`, `reportPath` (same semantics as the website “My reports” page). `binddate` in raw data is a concatenated string; invalid or empty values are handled safely and do not throw.

## Payment

Payment is always done on the website. MCP only lists purchased reports, returns polished content for them, and provides payment links for report types you have not purchased.
