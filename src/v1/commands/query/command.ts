import type { O } from 'ts-toolbelt'
import {
  QueryCommandInput,
  QueryCommand as _QueryCommand,
  QueryCommandOutput
} from '@aws-sdk/lib-dynamodb'

import type { TableV2 } from 'v1/table'
import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Item } from 'v1/schema'
import type { CountSelectOption } from 'v1/commands/constants/options/select'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'
import { isString } from 'v1/utils/validation'

import { TableCommand } from '../class'
import type { QueryOptions } from './options'
import { queryParams } from './queryParams'

type ReturnedItems<
  TABLE extends TableV2,
  ENTITIES extends EntityV2,
  OPTIONS extends QueryOptions<TABLE, ENTITIES>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (EntityV2 extends ENTITIES
      ? Item
      : ENTITIES extends infer ENTITY
      ? ENTITY extends EntityV2
        ? FormattedItem<ENTITY>
        : never
      : never)[]

export type QueryResponse<
  TABLE extends TableV2,
  ENTITIES extends EntityV2,
  OPTIONS extends QueryOptions<TABLE, ENTITIES>
> = O.Merge<Omit<QueryCommandOutput, 'Items'>, { Items?: ReturnedItems<TABLE, ENTITIES, OPTIONS> }>

export class QueryCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2 = EntityV2,
  OPTIONS extends QueryOptions<TABLE, ENTITIES> = QueryOptions<TABLE, ENTITIES>
> extends TableCommand<TABLE, ENTITIES> {
  static commandName = 'query' as const

  public entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => QueryCommand<
    TABLE,
    NEXT_ENTITIES[number],
    OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES[number]>
      ? OPTIONS
      : QueryOptions<TABLE, NEXT_ENTITIES[number]>
  >
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends QueryOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ) => QueryCommand<TABLE, ENTITIES, NEXT_OPTIONS>

  constructor(args: { table: TABLE; entities?: ENTITIES[] }, options: OPTIONS = {} as OPTIONS) {
    super(args)
    this._options = options

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new QueryCommand<
        TABLE,
        NEXT_ENTITIES[number],
        OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES[number]>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES[number]>
      >(
        {
          table: this._table,
          entities: nextEntities
        },
        this._options as OPTIONS extends QueryOptions<TABLE, NEXT_ENTITIES[number]>
          ? OPTIONS
          : QueryOptions<TABLE, NEXT_ENTITIES[number]>
      )
    this.options = nextOptions =>
      new QueryCommand({ table: this._table, entities: this._entities }, nextOptions)
  }

  params = (): QueryCommandInput => {
    const params = queryParams({ table: this._table, entities: this._entities }, this._options)

    return params
  }

  send = async (): Promise<QueryResponse<TABLE, ENTITIES, OPTIONS>> => {
    const queryParams = this.params()

    const commandOutput = await this._table.documentClient.send(new _QueryCommand(queryParams))

    const { Items: items, ...restCommandOutput } = commandOutput

    if (items === undefined) {
      return restCommandOutput
    }

    const entities = this._entities ?? []
    const entitiesByName: Record<string, EntityV2> = {}
    entities.forEach(entity => {
      entitiesByName[entity.name] = entity
    })

    const formattedItems: Item[] = []

    for (const item of items) {
      const itemEntityName = item[this._table.entityAttributeSavedAs]

      if (!isString(itemEntityName)) {
        continue
      }

      const itemEntity = entitiesByName[itemEntityName]

      if (itemEntity === undefined) {
        continue
      }

      formattedItems.push(formatSavedItem<EntityV2, {}>(itemEntity, item))
    }

    return {
      Items: formattedItems as QueryResponse<TABLE, ENTITIES, OPTIONS>['Items'],
      ...restCommandOutput
    }
  }
}

export type QueryCommandClass = typeof QueryCommand
