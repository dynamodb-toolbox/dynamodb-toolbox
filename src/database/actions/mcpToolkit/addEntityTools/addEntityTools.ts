import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type { Entity } from '~/entity/entity.js'

import { addDeleteEntityItemTool } from './addDeleteItemTool.js'
import { addGetEntityItemTool } from './addGetItemTool.js'
import { addPutEntityItemTool } from './addPutItemTool.js'
import type { AddEntityToolsOptions } from './options.js'

export const addEntityTools = (
  server: McpServer,
  entity: Entity,
  options: AddEntityToolsOptions
) => {
  addGetEntityItemTool(server, entity, options)

  if (options.readonly === true) {
    return
  }

  addPutEntityItemTool(server, entity, options)
  addDeleteEntityItemTool(server, entity, options)
}
