#!/usr/bin/env node
/**
 * ZiweiAI MCP Server (stdio).
 * Set env ZIWEIAI_MCP_API_KEY to your API key (from ziweiai "我的报告" -> MCP Integration).
 * Set ZIWEIAI_API_BASE to override API base (default https://ziweiai.com.cn).
 */
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
const API_KEY = process.env.ZIWEIAI_MCP_API_KEY || '';
const BASE = (process.env.ZIWEIAI_API_BASE || 'https://ziweiai.com.cn').replace(/\/$/, '');
function headers() {
    return {
        'Content-Type': 'application/json',
        'X-MCP-API-Key': API_KEY,
    };
}
async function apiGet(path) {
    const res = await fetch(`${BASE}${path}`, { method: 'GET', headers: headers() });
    if (!res.ok)
        throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
}
async function apiPost(path, body) {
    const res = await fetch(`${BASE}${path}`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(body),
    });
    if (!res.ok)
        throw new Error(`API ${res.status}: ${await res.text()}`);
    return res.json();
}
const server = new Server({
    name: 'ziweiai-mcp',
    version: '0.1.0',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: 'list_my_reports',
                description: 'List your purchased ZiweiAI reports (consumer list).',
                inputSchema: { type: 'object', properties: {} },
            },
            {
                name: 'list_report_types',
                description: 'List available ZiweiAI report types (paper codes: ming, ln, lc, ll, lr, cp, dh).',
                inputSchema: { type: 'object', properties: {} },
            },
            {
                name: 'get_report_content',
                description: 'Get polished report content. Pass generate params (gender, dt, y, m, d, h, etc.) plus language (e.g. zh, en).',
                inputSchema: {
                    type: 'object',
                    properties: {
                        language: { type: 'string', description: 'e.g. zh, en' },
                        gender: { type: 'number' },
                        dt: { type: 'number' },
                        y: { type: 'number' },
                        m: { type: 'number' },
                        d: { type: 'number' },
                        h: { type: 'number' },
                        mt: { type: 'number' },
                        ss: { type: 'number' },
                        username: { type: 'string' },
                        paper: { type: 'string' },
                        ln: { type: 'number' },
                        lm: { type: 'number' },
                        ld: { type: 'number' },
                        lr: { type: 'number' },
                        lc: { type: 'number' },
                        ll: { type: 'number' },
                        cp: { type: 'number' },
                        dh: { type: 'number' },
                        dy: { type: 'number' },
                        isleap: { type: 'number' },
                    },
                },
            },
            {
                name: 'get_payment_link',
                description: 'Get URL to purchase a report on the website. paper: ming, ln, lc, ll, lr, cp, dh.',
                inputSchema: {
                    type: 'object',
                    properties: {
                        paper: { type: 'string', description: 'ming, ln, lc, ll, lr, cp, dh' },
                    },
                },
            },
        ],
    };
});
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    if (!API_KEY) {
        return {
            content: [{ type: 'text', text: 'Error: ZIWEIAI_MCP_API_KEY is not set' }],
            isError: true,
        };
    }
    const { name, arguments: args } = request.params;
    try {
        if (name === 'list_my_reports') {
            const data = await apiPost('/api/mcp/reports', {});
            return {
                content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
                isError: false,
            };
        }
        if (name === 'list_report_types') {
            const text = [
                'ming -> 个性分析/一生运势 (life)',
                'ln -> 年度运势 (year)',
                'lc -> 事业 (career)',
                'll -> 情感 (love)',
                'lr -> 财富 (rich)',
                'cp -> 每日/日历 (calendar)',
                'dh -> 定盘 (detector)',
            ].join('\n');
            return { content: [{ type: 'text', text }], isError: false };
        }
        if (name === 'get_report_content') {
            const body = (args || {});
            const data = await apiPost('/api/mcp/reports/content', body);
            return {
                content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
                isError: false,
            };
        }
        if (name === 'get_payment_link') {
            const paper = (args && typeof args === 'object' && 'paper' in args)
                ? String(args.paper || 'ming')
                : 'ming';
            const data = await apiGet(`/api/mcp/payment-link?paper=${encodeURIComponent(paper)}`);
            return {
                content: [{ type: 'text', text: data.url || JSON.stringify(data) }],
                isError: false,
            };
        }
        return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
        };
    }
    catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return {
            content: [{ type: 'text', text: `Error: ${msg}` }],
            isError: true,
        };
    }
});
async function main() {
    if (!API_KEY) {
        console.error('Set ZIWEIAI_MCP_API_KEY (from ziweiai.com.cn -> 我的报告 -> MCP Integration)');
        process.exit(1);
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.error('ZiweiAI MCP server running (stdio)');
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
