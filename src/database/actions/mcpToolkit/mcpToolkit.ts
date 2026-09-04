import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type { Database } from '~/database/index.js'
import { DatabaseAction } from '~/database/index.js'

import { addAccessPatternTool } from './addAccessPatternTool.js'
import { addEntityTools } from './addEntityTools/index.js'
import type { AddToolsOptions } from './options.js'

/**
 * Database action that registers MCP tools for a database's entities and access patterns.
 */
export class MCPToolkit<DATABASE extends Database> extends DatabaseAction<DATABASE> {
  /**
   * Register MCP tools for every entity and access pattern on the given server.
   */
  addTools(mcpServer: McpServer, options: AddToolsOptions = {}): this {
    for (const [dbTableKey, dbTable] of Object.entries(this.database.tables)) {
      for (const entity of Object.values(dbTable.entities)) {
        addEntityTools(mcpServer, entity, { ...options, dbTableKey })
      }

      for (const [dbAccessPatternKey, accessPattern] of Object.entries(dbTable.accessPatterns)) {
        addAccessPatternTool(mcpServer, accessPattern, { dbTableKey, dbAccessPatternKey })
      }
    }

    return this
  }
}
