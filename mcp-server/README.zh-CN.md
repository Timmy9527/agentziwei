# 紫微 AI MCP Server

[![npm](https://img.shields.io/npm/v/ziweiai-mcp-server.svg)](https://www.npmjs.com/package/ziweiai-mcp-server)

**For English see [README.md](README.md).**

紫微 AI 的 MCP（Model Context Protocol）服务端，用于在 Cursor、Claude Desktop 等 MCP 客户端中列出已购报告、获取润色后的报告内容及支付链接。

**仓库地址：** [https://github.com/Timmy9527/agentziwei](https://github.com/Timmy9527/agentziwei)

## 安装

**方式一：使用 npm 包（推荐）**

```bash
npm install ziweiai-mcp-server
```

不安装直接运行（需 Node.js ≥18）：

```bash
npx ziweiai-mcp-server
```

**方式二：从源码构建（克隆仓库后）**

```bash
cd mcp-server
npm install
npm run build
```

## 前置条件

1. **MCP API Key**：登录 [ziweiai.com.cn](https://ziweiai.com.cn) 或 [ziweai.com](https://ziweai.com)，进入 **我的报告**，在页面上方找到 **MCP 集成**，点击 **生成 MCP API Key**。复制 Key（仅显示一次）。
2. **报告**：请先在网站购买报告；MCP 仅可查询已购报告并获取其内容。

## 环境变量

| 变量 | 必填 | 说明 |
|------|------|------|
| `ZIWEIAI_MCP_API_KEY` | 是 | 在网站获取的 MCP API Key。 |
| `ZIWEIAI_API_BASE` | 否 | 接口基础 URL（默认：`https://ziweiai.com.cn`）。 |

## 运行

**若通过 npm 安装：**

```bash
export ZIWEIAI_MCP_API_KEY="你的 Key"
npx ziweiai-mcp-server
```

或全局安装后使用：`npm install -g ziweiai-mcp-server`，然后执行 `ziweiai-mcp`。

**若从源码构建：**

```bash
export ZIWEIAI_MCP_API_KEY="你的 Key"
node dist/index.js
```

或使用 tsx 直接运行源码（无需先 build）：`ZIWEIAI_MCP_API_KEY="你的 Key" npx tsx src/index.ts`

## Cursor 配置

在 Cursor 的 MCP 配置中（如 `~/.cursor/mcp.json` 或 **Cursor 设置 → Features → MCP**）添加：

**使用 npm 包（推荐）：**

```json
{
  "mcpServers": {
    "ziweiai": {
      "command": "npx",
      "args": ["-y", "ziweiai-mcp-server"],
      "env": {
        "ZIWEIAI_MCP_API_KEY": "你的 MCP API Key"
      }
    }
  }
}
```

`-y` 表示 npx 直接使用包而无需确认。将 `你的 MCP API Key` 替换为上述获取的 Key。

**使用本地构建（需先克隆仓库）：**

```json
{
  "mcpServers": {
    "ziweiai": {
      "command": "node",
      "args": ["/本机路径/ziweiai/mcp-server/dist/index.js"],
      "env": {
        "ZIWEIAI_MCP_API_KEY": "你的 MCP API Key"
      }
    }
  }
}
```

将 `/本机路径/ziweiai` 替换为实际仓库路径。

## 工具说明

- **list_my_reports**：列出当前账号下已购买的报告。
- **list_report_types**：列出报告类型代码（ming, ln, lc, ll, lr, cp, dh）及含义。
- **get_report_content**：获取指定报告的润色后内容（需传入与生成报告一致的参数及 language）。
- **get_payment_link**：获取某报告类型的购买页面链接（查询参数：`paper`）。

### 列表报告接口（GET/POST /api/mcp/reports）

- **鉴权**：请求头 `X-MCP-API-Key` 为您的 MCP API Key。
- **查询参数**（可选）：`format=human`（返回可读字段）、`lang=zh` 或 `lang=en`（format=human 时默认 en）。不传 `format` 则返回原始数组。
- **format=human 时**：每项包含 `reportType`、`queryInfo`、`reportPath`，与网站「我的报告」页展示一致。原始数据中的 `binddate` 为拼接字符串；异常或空值会安全处理，不会抛错。

## 支付说明

支付均在网站完成。MCP 仅可列出已购报告、获取其润色内容，以及获取未购报告类型的支付链接。
