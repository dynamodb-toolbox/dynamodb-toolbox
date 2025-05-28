import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { PutItemCommand } from '~/entity/actions/put/index.js'
import { putItemCommandReturnValuesOptions } from '~/entity/actions/put/options.js'
import type { Entity } from '~/entity/entity.js'
import { capacityOptions } from '~/options/capacity.js'
import { metricsOptions } from '~/options/metrics.js'
import { ZodSchemer } from '~/schema/actions/zodSchemer/index.js'

import type { AddEntityToolsOptions } from './options.js'

const defaultPutOptionsSchema = z
  .object({
    capacity: z.enum(capacityOptions),
    metrics: z.enum(metricsOptions),
    returnValues: z.enum(putItemCommandReturnValuesOptions),
    tableName: z.string()
  })
  .partial()
  .default({})

export const addPutEntityItemTool = (
  server: McpServer,
  entity: Entity,
  options: AddEntityToolsOptions
) => {
  const { entityName, table } = entity
  const { dbTableKey } = options

  const tableName = table.tableName !== undefined ? table.getName() : undefined
  const hasTableName = tableName !== undefined

  const putOptionsSchema = hasTableName
    ? defaultPutOptionsSchema
    : defaultPutOptionsSchema.removeDefault().required({ tableName: true })

  const putToolName = `ddb-tb_put-${entityName}-item-in-${dbTableKey}-table`.substring(0, 64)
  let putToolDescription = `Put a '${entityName}' Item in the ${tableName ?? dbTableKey} Table.`

  const { title, description } = entity.meta
  if (title !== undefined) {
    putToolDescription += `\n# ${title}`
  }
  if (description !== undefined) {
    putToolDescription += `\n\n${description}.`
  }

  server.tool(
    putToolName,
    putToolDescription,
    {
      item: new ZodSchemer(entity.schema).parser({ transform: false }) as z.ZodTypeAny,
      options: putOptionsSchema
    },
    { title: putToolDescription, readOnlyHint: false, destructiveHint: false },
    async ({ item, options }) => {
      try {
        const Response = await new PutItemCommand(entity, item, options).send()

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
