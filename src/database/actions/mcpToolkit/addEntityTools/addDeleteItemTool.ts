import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { DeleteItemCommand } from '~/entity/actions/delete/index.js'
import { deleteItemCommandReturnValuesOptions } from '~/entity/actions/delete/options.js'
import type { Entity } from '~/entity/index.js'
import { capacityOptions } from '~/options/capacity.js'
import { metricsOptions } from '~/options/metrics.js'
import { ZodSchemer } from '~/schema/actions/zodSchemer/index.js'

import type { AddEntityToolsOptions } from './options.js'

const defaultDeleteOptionsSchema = z
  .object({
    capacity: z.enum(capacityOptions),
    metrics: z.enum(metricsOptions),
    returnValues: z.enum(deleteItemCommandReturnValuesOptions),
    tableName: z.string()
  })
  .partial()
  .default({})

export const addDeleteEntityItemTool = (
  server: McpServer,
  entity: Entity,
  options: AddEntityToolsOptions
) => {
  const { entityName, table } = entity
  const { tableDBKey } = options

  const tableName = table.tableName !== undefined ? table.getName() : undefined
  const hasTableName = tableName !== undefined

  const deleteOptionsSchema = hasTableName
    ? defaultDeleteOptionsSchema
    : defaultDeleteOptionsSchema.removeDefault().required({ tableName: true })

  const deleteToolName = `ddb-tb_delete-${entityName}-item-from-${tableDBKey}-table`.substring(
    0,
    64
  )
  const deleteToolDescription = `Delete a '${entityName}' Item from the ${tableName ?? tableDBKey} Table.`
  // TODO: Add metadata to Entities

  server.tool(
    deleteToolName,
    deleteToolDescription,
    {
      key: new ZodSchemer(entity.schema).parser({ mode: 'key', transform: false }) as z.ZodTypeAny,
      options: deleteOptionsSchema
    },
    { title: deleteToolDescription, readOnlyHint: false, destructiveHint: true },
    async ({ key, options }) => {
      try {
        const Response = await new DeleteItemCommand(entity, key, options).send()

        return {
          content: [{ type: 'text', text: JSON.stringify(Response) }]
        }
      } catch (error) {
        return {
          content: [{ type: 'text', text: String(error), isError: true }]
        }
      }
    }
  )
}
