import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { z } from 'zod'

import {
  $meta as $entityMeta,
  $schema as $entitySchema
} from '~/entity/actions/accessPattern/constants.js'
import { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import { capacityOptions } from '~/options/capacity.js'
import { selectOptions } from '~/options/select.js'
import { ZodSchemer } from '~/schema/actions/zodSchemer/index.js'
import type { Schema } from '~/schema/index.js'
import {
  $meta as $tableMeta,
  $schema as $tableSchema
} from '~/table/actions/accessPattern/constants.js'
import { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import type { QueryCommand, QueryOptions } from '~/table/actions/query/index.js'
import { $entities } from '~/table/index.js'
import type { Table } from '~/table/index.js'

const defaultQueryOptionsSchema = z
  .object({
    capacity: z.enum(capacityOptions),
    exclusiveStartKey: z.record(z.string(), z.any()),
    limit: z.number(),
    maxPages: z.number(),
    reverse: z.boolean(),
    consistent: z.boolean(),
    entityAttrFilter: z.boolean(),
    showEntityAttr: z.boolean(),
    attributes: z.array(z.string()).min(1),
    select: z.enum(selectOptions),
    tableName: z.string()
  })
  .partial()
  .default({})

interface AddAccessPatternToolOptions {
  dbTableKey: string
  dbAccessPatternKey: string
}

export const addAccessPatternTool = (
  server: McpServer,
  accessPattern: IEntityAccessPattern | ITableAccessPattern,
  { dbTableKey, dbAccessPatternKey }: AddAccessPatternToolOptions
): void => {
  let table: Table | undefined = undefined
  let entity: Entity | undefined = undefined
  let schema: Schema | undefined = undefined
  let meta: { title?: string; description?: string } = {}

  if (accessPattern instanceof IEntityAccessPattern) {
    table = accessPattern.entity.table
    entity = accessPattern.entity
    meta = accessPattern[$entityMeta]
    schema = accessPattern[$entitySchema]
  }

  if (accessPattern instanceof ITableAccessPattern) {
    table = accessPattern.table
    const entities = accessPattern[$entities]
    if (entities.length === 1) {
      entity = entities[0]
    }
    meta = accessPattern[$tableMeta]
    schema = accessPattern[$tableSchema]
  }

  if (table === undefined || schema === undefined) {
    return
  }

  const tableName = table.tableName !== undefined ? table.getName() : undefined
  const hasTableName = tableName !== undefined

  const queryOptionsSchema = hasTableName
    ? defaultQueryOptionsSchema
    : defaultQueryOptionsSchema.removeDefault().required({ tableName: true })

  const queryToolName = `ddb-tb_use-${dbAccessPatternKey}-access-pattern`.substring(0, 64)
  let queryToolDescription = `Query multiple ${entity !== undefined ? `'${entity.entityName}' ` : ''} Items from the ${tableName ?? dbTableKey} Table using the ${dbAccessPatternKey} AccessPattern.`

  const { title, description } = meta
  if (title !== undefined) {
    queryToolDescription += `\n# ${title}`
  }
  if (description !== undefined) {
    queryToolDescription += `\n\n${description}.`
  }

  server.tool(
    queryToolName,
    queryToolDescription,
    {
      query: new ZodSchemer(schema).parser({ transform: false }),
      options: queryOptionsSchema
    },
    { title: queryToolDescription, readOnlyHint: true, destructiveHint: false },
    async ({ query, options }) => {
      try {
        let command = accessPattern.query(query) as QueryCommand

        if (Object.values(options).length > 0) {
          command = command.options(options as QueryOptions)
        }

        const Response = await command.send()

        if (Response.Items === undefined) {
          Response.Items = []
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
