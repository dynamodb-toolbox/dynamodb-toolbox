import type { A } from 'ts-toolbelt'

import { Database } from '~/database/database.js'
import { Entity } from '~/entity/entity.js'
import { item } from '~/schema/item/index.js'
import { string } from '~/schema/string/index.js'
import { Registry } from '~/table/actions/registry/index.js'
import { Table } from '~/table/table.js'

import { Synchronizer } from './synchronizer.js'

const API_URL = 'https://api.dynamodb-toolshack.com'
const API_KEY = 'poke-api-key'
const AWS_ACCOUNT_ID = '398259209128'
const AWS_REGION = 'us-east-1'

const awsAccount = { awsAccountId: AWS_ACCOUNT_ID, awsRegion: AWS_REGION }

const tableUrl = (tableName: string, ...segments: string[]): string =>
  [API_URL, 'table', AWS_ACCOUNT_ID, AWS_REGION, tableName, ...segments].join('/')

interface FetchCall {
  method: string
  url: string
}

interface RemoteTable {
  tableName: string
  awsAccountId?: string
  awsRegion?: string
}

interface FetchOverride {
  method: string
  url: string
  status: number
  body?: unknown
}

const jsonResponse = (status: number, body: unknown): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body)
  }) as unknown as Response

/**
 * Record the HTTP calls a sync makes and reply with registry-shaped payloads.
 *
 * `remoteTables` default to the bound account and region, so a test only names
 * the ones that live elsewhere.
 */
const mockFetch = ({
  remoteTables = [],
  remoteEntityNames = {},
  overrides = []
}: {
  remoteTables?: RemoteTable[]
  remoteEntityNames?: Record<string, string[]>
  overrides?: FetchOverride[]
} = {}): { calls: FetchCall[]; fetch: typeof fetch } => {
  const calls: FetchCall[] = []

  const accountOf = ({ awsAccountId = AWS_ACCOUNT_ID }: RemoteTable): string => awsAccountId

  const awsAccounts = [...new Set(remoteTables.map(accountOf))].map(awsAccountId => ({
    awsAccountId,
    tables: remoteTables
      .filter(remoteTable => accountOf(remoteTable) === awsAccountId)
      .map(({ tableName, awsRegion = AWS_REGION }) => ({ tableName, awsRegion }))
  }))

  const _fetch = ((...[input, init]: Parameters<typeof fetch>): Promise<Response> => {
    const url = String(input)
    const method = init?.method ?? 'GET'

    calls.push({ method, url })

    const override = overrides.find(
      candidate => candidate.method === method && candidate.url === url
    )
    if (override !== undefined) {
      return Promise.resolve(jsonResponse(override.status, override.body ?? {}))
    }

    if (method === 'GET' && url === [API_URL, 'aws-account'].join('/')) {
      return Promise.resolve(jsonResponse(200, { awsAccounts }))
    }

    if (method === 'GET' && url.endsWith('/entity')) {
      const tableName = url.split('/').at(-2) ?? ''
      const entityNames = remoteEntityNames[tableName] ?? []

      return Promise.resolve(
        jsonResponse(200, { entities: entityNames.map(entityName => ({ entityName })) })
      )
    }

    return Promise.resolve(jsonResponse(200, {}))
  }) as typeof fetch

  return { calls, fetch: _fetch }
}

const listTableCalls = (calls: FetchCall[]): FetchCall[] =>
  calls.filter(({ method, url }) => method === 'GET' && url === [API_URL, 'aws-account'].join('/'))

const deleteTableCalls = (calls: FetchCall[]): FetchCall[] =>
  calls.filter(({ method, url }) => method === 'DELETE' && !url.includes('/entity'))

const listEntityCalls = (calls: FetchCall[]): FetchCall[] =>
  calls.filter(({ method, url }) => method === 'GET' && url.endsWith('/entity'))

const deleteEntityCalls = (calls: FetchCall[]): FetchCall[] =>
  calls.filter(({ method, url }) => method === 'DELETE' && url.includes('/entity'))

const partitionKey = { name: 'pk', type: 'string' } as const

const pokeTable = new Table({ name: 'poke-table', partitionKey })
const trainerTable = new Table({ name: 'trainer-table', partitionKey })

const pokemonEntity = new Entity({
  name: 'pokemon',
  schema: item({ pk: string().key(), name: string() }),
  table: pokeTable
})

describe('Synchronizer - deleteUnknownTables', () => {
  describe('happy path', () => {
    test('AC1: deletes remote tables that the database does not declare', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [
          { tableName: 'poke-table' },
          { tableName: 'trainer-table' },
          { tableName: 'ghost-table' }
        ]
      })

      await new Database({ poke: pokeTable, trainer: trainerTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('ghost-table') }
      ])
    })

    test('AC2: deletes only once every push has been issued', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }]
      })

      await new Database({ poke: pokeTable.build(Registry).registerEntities(pokemonEntity) })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      const lastPutIndex = calls.reduce(
        (lastIndex, { method }, index) => (method === 'PUT' ? index : lastIndex),
        -1
      )
      const firstDeleteIndex = calls.findIndex(({ method }) => method === 'DELETE')

      expect(lastPutIndex).toBeGreaterThan(-1)
      expect(firstDeleteIndex).toBeGreaterThan(lastPutIndex)
    })

    test('AC3: makes no extra call when the option is omitted', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }]
      })

      await new Database({ poke: pokeTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, fetch })

      expect(listTableCalls(calls)).toStrictEqual([])
      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC4: prunes tables without touching entities', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }],
        remoteEntityNames: { 'poke-table': ['pokemon', 'ghost'] }
      })

      await new Database({ poke: pokeTable.build(Registry).registerEntities(pokemonEntity) })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('ghost-table') }
      ])
      expect(listEntityCalls(calls)).toStrictEqual([])
      expect(deleteEntityCalls(calls)).toStrictEqual([])
    })

    test('AC4: prunes entities without touching tables', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }],
        remoteEntityNames: { 'poke-table': ['pokemon', 'ghost'] }
      })

      await new Database({ poke: pokeTable.build(Registry).registerEntities(pokemonEntity) })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownEntities: true, fetch })

      expect(deleteEntityCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('poke-table', 'entity', 'ghost') }
      ])
      expect(listTableCalls(calls)).toStrictEqual([])
      expect(deleteTableCalls(calls)).toStrictEqual([])
    })
  })

  describe('edge cases', () => {
    test('AC5: prunes every remote table when the database declares none', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }]
      })

      await new Database({})
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('poke-table') },
        { method: 'DELETE', url: tableUrl('ghost-table') }
      ])
    })

    test('AC6: lists but deletes nothing when every remote table is declared', async () => {
      const { calls, fetch } = mockFetch({ remoteTables: [{ tableName: 'poke-table' }] })

      await new Database({ poke: pokeTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(listTableCalls(calls)).toHaveLength(1)
      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC7: resolves when the remote list is empty', async () => {
      const { calls, fetch } = mockFetch()

      await expect(
        new Database({ poke: pokeTable })
          .build(Synchronizer)
          .awsAccount(awsAccount)
          .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })
      ).resolves.toBeUndefined()

      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC8: keeps a table declared by two registries', async () => {
      const duplicateTable = new Table({ name: 'poke-table', partitionKey })

      const { calls, fetch } = mockFetch({ remoteTables: [{ tableName: 'poke-table' }] })

      await new Database({ poke: pokeTable, duplicate: duplicateTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC9: ignores remote tables of another region or account', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [
          { tableName: 'poke-table' },
          { tableName: 'eu-table', awsRegion: 'eu-west-1' },
          { tableName: 'other-account-table', awsAccountId: '000000000000' }
        ]
      })

      await new Database({ poke: pokeTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC10: resolves a dynamic table name before comparing it', async () => {
      const dynamicTable = new Table({ name: () => 'poke-table', partitionKey })

      const { calls, fetch } = mockFetch({ remoteTables: [{ tableName: 'poke-table' }] })

      await new Database({ poke: dynamicTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })

      expect(deleteTableCalls(calls)).toStrictEqual([])
    })
  })

  describe('error states', () => {
    test('AC11: rejects and deletes nothing when the list call fails', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'ghost-table' }],
        overrides: [
          {
            method: 'GET',
            url: [API_URL, 'aws-account'].join('/'),
            status: 500,
            body: { message: 'Internal Server Error' }
          }
        ]
      })

      await expect(
        new Database({ poke: pokeTable })
          .build(Synchronizer)
          .awsAccount(awsAccount)
          .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })
      ).rejects.toThrow('Internal Server Error')

      expect(deleteTableCalls(calls)).toStrictEqual([])
    })

    test('AC12: tolerates a 404 and carries on deleting', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'ghost-table' }, { tableName: 'haunter-table' }],
        overrides: [
          {
            method: 'DELETE',
            url: tableUrl('ghost-table'),
            status: 404,
            body: { message: 'Table not found' }
          }
        ]
      })

      await expect(
        new Database({ poke: pokeTable })
          .build(Synchronizer)
          .awsAccount(awsAccount)
          .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })
      ).resolves.toBeUndefined()

      expect(deleteTableCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('ghost-table') },
        { method: 'DELETE', url: tableUrl('haunter-table') }
      ])
    })

    test('AC13: rejects on a failed deletion and skips the remaining ones', async () => {
      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'ghost-table' }, { tableName: 'haunter-table' }],
        overrides: [
          {
            method: 'DELETE',
            url: tableUrl('ghost-table'),
            status: 500,
            body: { message: 'Internal Server Error' }
          }
        ]
      })

      await expect(
        new Database({ poke: pokeTable })
          .build(Synchronizer)
          .awsAccount(awsAccount)
          .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })
      ).rejects.toThrow('Internal Server Error')

      expect(deleteTableCalls(calls)).toStrictEqual([
        { method: 'DELETE', url: tableUrl('ghost-table') }
      ])
    })

    test('AC14: rejects before any call when the AWS account is missing', async () => {
      const { calls, fetch } = mockFetch({ remoteTables: [{ tableName: 'ghost-table' }] })

      await expect(
        new Database({ poke: pokeTable })
          .build(Synchronizer)
          .sync({ apiKey: API_KEY, deleteUnknownTables: true, fetch })
      ).rejects.toThrow('Synchronizer incomplete: Missing "awsConfig" property')

      expect(calls).toStrictEqual([])
    })
  })

  describe('type level', () => {
    test('AC15: exposes deleteUnknownTables as an optional boolean', () => {
      const synchronizer = new Database({ poke: pokeTable })
        .build(Synchronizer)
        .awsAccount(awsAccount)

      const assertOption: A.Equals<
        Parameters<typeof synchronizer.sync>[0]['deleteUnknownTables'],
        boolean | undefined
      > = 1
      assertOption

      const assertReturn: A.Equals<ReturnType<typeof synchronizer.sync>, Promise<void>> = 1
      assertReturn
    })
  })

  describe('impact on existing features', () => {
    test('AC16: leaves the call sequence untouched when the option is omitted', async () => {
      const accessRoleTable = new Table({
        name: 'poke-table',
        partitionKey,
        meta: {
          title: 'Pokedex',
          _ddbToolshack: { icon: 'cat', accessRole: { roleName: 'PokeRole' } }
        }
      })

      const { calls, fetch } = mockFetch({
        remoteTables: [{ tableName: 'poke-table' }, { tableName: 'ghost-table' }]
      })

      await new Database({
        poke: accessRoleTable.build(Registry).registerEntities(pokemonEntity)
      })
        .build(Synchronizer)
        .awsAccount(awsAccount)
        .sync({ apiKey: API_KEY, fetch })

      expect(calls).toStrictEqual([
        { method: 'PUT', url: [API_URL, 'aws-account'].join('/') },
        { method: 'PUT', url: [API_URL, 'table'].join('/') },
        { method: 'GET', url: [API_URL, 'access-role', AWS_ACCOUNT_ID, 'PokeRole'].join('/') },
        { method: 'POST', url: tableUrl('poke-table', 'access-role') },
        { method: 'PUT', url: tableUrl('poke-table', 'entity') }
      ])
    })
  })
})
