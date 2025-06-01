---
title: MCPToolkit
sidebar_custom_props:
  sidebarActionType: util
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# MCPToolkit

:::note

`MCPToolkit` requires the `zod` and `@modelcontextprotocol/sdk` dependencies to be installed first:

```bash
npm install zod @modelcontextprotocol/sdk
```

:::

A utility for quickly adding [Tools](https://modelcontextprotocol.io/docs/concepts/tools) to an [MCP Server](https://modelcontextprotocol.io/examples), enabling any [MCP Clients](https://modelcontextprotocol.io/clients) (like [Claude](https://claude.ai) or [Cursor](https://www.cursor.com/)) to interact with your DynamoDB Tables using natural language.

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { MCPToolkit } from 'dynamodb-toolbox/database/actions/mcpToolkit'

// Set up your MCP Server as usual
const server = new McpServer(...)

const mcpToolkit = PokeDB.build(MCPToolkit)
mcpToolkit.addTools(server)
```

:::info

We highly recommend adding `title` and `description` metadata to your models for better LLM processing. For more details, see:

- For Tables: The [`meta`](../../../2-tables/1-usage/index.md#meta) property
- For Entities: The [`meta`](../../../3-entities/1-usage/index.md#meta) property
- For Table Access Patterns: The [`meta`](../../../2-tables/2-actions/3-access-pattern/index.md#meta) method
- For Entity Access Patterns: The [`meta`](../../../3-entities/4-actions/2-access-pattern/index.md#meta) method

:::

## Methods

### `addTools(...)`

<p style={{ marginTop: '-15px' }}><i><code>(server:McpServer, options?: Options) => MCPToolkit</code></i></p>

Adds DynamoDB-Toolbox querying tools to an [MCP Server](https://modelcontextprotocol.io/examples). See [Available Tools](#available-tools) for a list of supported operations.

:::note[Examples]

<Tabs>
<TabItem value="usage" label="Usage">

```ts
mcpToolkit.addTools(server)
```

</TabItem>
<TabItem value="readonly" label="Read-only">

```ts
mcpToolkit.addTools(server, { readonly: true })
```

</TabItem>
</Tabs>

:::

## Available tools

The following tools are available:

### Access Pattern Tools

#### `ddb-tb_use-<KEY>-access-pattern-on-<TABLE>-table`

Enables querying items from the database using a registered `AccessPattern`.

### Entity Tools

#### `ddb-tb_get-${entityName}-item-from-${dbTableKey}-table`

Enables retrieving an entity item from the database.

#### `ddb-tb_put-${entityName}-item-in-${dbTableKey}-table`

<p style={{ marginTop: '-15px' }}><i>(Unavailable in <code>readonly</code> mode)</i></p>

Enables deleting an entity item from the database.

#### `ddb-tb_delete-${entityName}-item-from-${dbTableKey}-table`

<p style={{ marginTop: '-15px' }}><i>(Unavailable in <code>readonly</code> mode)</i></p>

Enables deleting an entity item from the database.

:::info

All tools automatically apply validation, default values, links, encoding/decoding and formatting.

:::
