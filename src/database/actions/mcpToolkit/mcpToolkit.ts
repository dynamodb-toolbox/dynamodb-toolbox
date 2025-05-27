import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type { Database } from '~/database/index.js'
import { DatabaseAction } from '~/database/index.js'

import { addAccessPatternTool } from './addAccessPatternTool.js'
import { addEntityTools } from './addEntityTools/index.js'
import type { AddToolsOptions } from './options.js'

export class MCPToolkit<DATABASE extends Database> extends DatabaseAction<DATABASE> {
  addTools(mcpServer: McpServer, options: AddToolsOptions = {}): this {
    for (const [tableDBKey, table] of Object.entries(this.database.tables)) {
      for (const entity of Object.values(table.entities)) {
        addEntityTools(mcpServer, entity, { ...options, tableDBKey })
      }

      for (const [accessPatternDBKey, accessPattern] of Object.entries(table.accessPatterns)) {
        addAccessPatternTool(mcpServer, accessPattern, { tableDBKey, accessPatternDBKey })
      }
    }

    return this
  }
}
