import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import type { Entity } from '~/entity/index.js'

import type { AddToolsOptions } from '../options.js'
import { addDeleteEntityItemTool } from './addDeleteItemTool.js'
import { addGetEntityItemTool } from './addGetItemTool.js'
import { addPutEntityItemTool } from './addPutItemTool.js'

interface AddEntityToolsOptions extends AddToolsOptions {
  tableDBKey: string
}

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
