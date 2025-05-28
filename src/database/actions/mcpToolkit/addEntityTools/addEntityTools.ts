import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type { DB as DBEntity } from '~/database/utils/dbEntity.js'

import { addDeleteEntityItemTool } from './addDeleteItemTool.js'
import { addGetEntityItemTool } from './addGetItemTool.js'
import { addPutEntityItemTool } from './addPutItemTool.js'
import type { AddEntityToolsOptions } from './options.js'

export const addEntityTools = (
  server: McpServer,
  dbEntity: DBEntity,
  options: AddEntityToolsOptions
) => {
  addGetEntityItemTool(server, dbEntity, options)

  if (options.readonly === true) {
    return
  }

  addPutEntityItemTool(server, dbEntity, options)
  addDeleteEntityItemTool(server, dbEntity, options)
}
