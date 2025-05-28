import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import { $entity } from '~/database/constants.js'
import type { DB as DBEntity } from '~/database/utils/dbEntity.js'
import { GetItemCommand } from '~/entity/actions/get/index.js'
import { capacityOptions } from '~/options/capacity.js'
import { ZodSchemer } from '~/schema/actions/zodSchemer/index.js'

import type { AddEntityToolsOptions } from './options.js'

const defaultGetOptionsSchema = z
  .object({
    capacity: z.enum(capacityOptions),
    consistent: z.boolean(),
    attributes: z.array(z.string()).min(1),
    tableName: z.string()
  })
  .partial()
  .default({})

export const addGetEntityItemTool = (
  server: McpServer,
  dbEntity: DBEntity,
  options: AddEntityToolsOptions
) => {
  const { entityName, table } = dbEntity
  const { dbTableKey } = options

  const tableName = table.tableName !== undefined ? table.getName() : undefined
  const hasTableName = tableName !== undefined

  const getOptionsSchema = hasTableName
    ? defaultGetOptionsSchema
    : defaultGetOptionsSchema.removeDefault().required({ tableName: true })

  const getToolName = `ddb-tb_get-${entityName}-item-from-${dbTableKey}-table`
  let getToolDescription = `Get a '${entityName}' Item from the ${tableName ?? dbTableKey} Table.`

  const { title, description } = dbEntity.meta
  if (title !== undefined) {
    getToolDescription += `\n# ${title}`
  }
  if (description !== undefined) {
    getToolDescription += `\n\n${description}.`
  }

  server.tool(
    getToolName,
    getToolDescription,
    {
      key: new ZodSchemer(dbEntity.schema).parser({
        mode: 'key',
        transform: false
      }) as z.ZodTypeAny,
      options: getOptionsSchema
    },
    { title: getToolDescription, readOnlyHint: true },
    async ({ key, options }) => {
      try {
        const Response = await new GetItemCommand(dbEntity[$entity], key, options).send()

        if (Response.Item === undefined) {
          return {
            content: [{ type: 'text', text: 'Unable to find item', isError: true }]
          }
        }

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
