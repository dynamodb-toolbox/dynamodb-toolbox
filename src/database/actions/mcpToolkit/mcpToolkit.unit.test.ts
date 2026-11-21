import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

import { Database } from '~/database/database.js'
import { AccessPattern } from '~/entity/actions/accessPattern/index.js'
import { Entity } from '~/entity/entity.js'
import { item } from '~/schema/item/index.js'
import { number } from '~/schema/number/index.js'
import { string } from '~/schema/string/index.js'
import { Registry } from '~/table/actions/registry/index.js'
import { Table } from '~/table/table.js'

import { MCPToolkit } from './mcpToolkit.js'

const partitionKey = { name: 'pk', type: 'string' } as const

const pokeTable = new Table({ name: 'poke-table', partitionKey })

const pokemonEntity = new Entity({
  name: 'pokemon',
  schema: item({ pokemonId: string().key().savedAs('pk'), level: number() }),
  table: pokeTable
})

const byId = pokemonEntity
  .build(AccessPattern)
  .schema(string())
  .pattern(partition => ({ partition }))

const database = new Database({
  poke: pokeTable.build(Registry).registerEntities(pokemonEntity).registerAccessPatterns({ byId })
})

const propertyNames = (jsonSchema: unknown): string[] =>
  Object.keys((jsonSchema as { properties?: Record<string, unknown> }).properties ?? {})

describe('MCPToolkit', () => {
  test('registers the entity and access pattern tools, and exposes their input schemas', async () => {
    const server = new McpServer({ name: 'poke-server', version: '1.0.0' })
    database.build(MCPToolkit).addTools(server)

    const client = new Client({ name: 'poke-client', version: '1.0.0' })
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair()
    await Promise.all([client.connect(clientTransport), server.connect(serverTransport)])

    const { tools } = await client.listTools()
    await Promise.all([client.close(), server.close()])

    expect(tools.map(({ name }) => name).sort()).toStrictEqual([
      'ddb-tb_delete-pokemon-item-from-poke-table',
      'ddb-tb_get-pokemon-item-from-poke-table',
      'ddb-tb_put-pokemon-item-in-poke-table',
      'ddb-tb_use-byId-access-pattern-on-poke-table'
    ])

    const getTool = tools.find(({ name }) => name.startsWith('ddb-tb_get-'))
    const putTool = tools.find(({ name }) => name.startsWith('ddb-tb_put-'))
    const queryTool = tools.find(({ name }) => name.startsWith('ddb-tb_use-'))

    // The SDK derives each tool's input schema from the emitted zod schema, so a schema it could
    // not read would surface here as missing properties
    expect(propertyNames(getTool?.inputSchema)).toStrictEqual(['key', 'options'])
    expect(getTool?.inputSchema.required).toStrictEqual(['key'])

    // `mode: 'key'` keeps the key attribute under its app-side name and drops the others
    expect(propertyNames(getTool?.inputSchema.properties?.key)).toStrictEqual(['pokemonId'])

    // Sorted, as the order of the internal attributes the entity injects is not this action's
    expect(propertyNames(putTool?.inputSchema.properties?.item).sort()).toStrictEqual([
      'created',
      'entity',
      'level',
      'modified',
      'pokemonId'
    ])

    // An access pattern's input is its own schema, a primitive one here
    expect(propertyNames(queryTool?.inputSchema)).toStrictEqual(['query', 'options'])
    expect(queryTool?.inputSchema.properties?.query).toStrictEqual({ type: 'string' })
  })
})
