# ZiweiAI MCP Server

MCP (Model Context Protocol) server for ZiweiAI reports. Use it in Cursor, Claude Desktop, or other MCP clients to list your reports, get polished report content, and get payment links.

## Prerequisites

1. **MCP API Key**: Log in at [ziweiai.com.cn](https://ziweiai.com.cn), go to **我的报告** (My Reports), scroll to **MCP 集成**, and click **生成 MCP API Key**. Copy the key (it is shown only once).
2. **Reports**: Purchase reports on the website first; MCP can only list purchased reports and fetch their content.

## Setup

```bash
cd mcp-server
npm install
npm run build
```

## Environment

| Variable | Required | Description |
|----------|----------|-------------|
| `ZIWEIAI_MCP_API_KEY` | Yes | Your MCP API key from the website. |
| `ZIWEIAI_API_BASE` | No | API base URL (default: `https://ziweiai.com.cn`). |

## Run

```bash
export ZIWEIAI_MCP_API_KEY="your-key-here"
node dist/index.js
```

Or with `tsx` (no build):

```bash
ZIWEIAI_MCP_API_KEY="your-key" npx tsx src/index.ts
```

## Cursor configuration

Add to Cursor MCP settings (e.g. `~/.cursor/mcp.json` or project MCP config):

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

Replace `/path/to/ziweiai` with the real path and `your-mcp-api-key` with your key.

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
