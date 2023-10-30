import type { O } from 'ts-toolbelt'
import {
  ScanCommandInput,
  ScanCommand as _ScanCommand,
  ScanCommandOutput
} from '@aws-sdk/lib-dynamodb'

import type { TableV2 } from 'v1/table'
import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Item } from 'v1/schema'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'
import { isString } from 'v1/utils/validation'

import type { TableCommandClass } from '../class'
import type { ScanOptions } from './options'
import { scanParams } from './scanParams'

export type ScanResponse<ENTITIES extends EntityV2> = O.Merge<
  Omit<ScanCommandOutput, 'Items'>,
  {
    // TODO: Update Response according to Select option
    Items?: (EntityV2 extends ENTITIES
      ? Item
      : ENTITIES extends infer ENTITY
      ? ENTITY extends EntityV2
        ? FormattedItem<ENTITY>
        : never
      : never)[]
  }
>

export class ScanCommand<TABLE extends TableV2 = TableV2, ENTITIES extends EntityV2 = EntityV2>
  implements TableCommandClass<TABLE, ENTITIES> {
  static commandType = 'scan' as const

  public _table: TABLE
  public _entities: ENTITIES[]
  public entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => ScanCommand<TABLE, NEXT_ENTITIES[number]>
  public _options: ScanOptions
  public options: (nextOptions: ScanOptions<ENTITIES>) => ScanCommand<TABLE, ENTITIES>

  constructor(
    { table, entities = [] }: { table: TABLE; entities?: ENTITIES[] },
    options: ScanOptions = {}
  ) {
    this._table = table
    this._entities = entities
    this._options = options

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new ScanCommand(
        {
          table: this._table,
          entities: nextEntities
        },
        this._options
      )
    this.options = nextOptions =>
      new ScanCommand({ table: this._table, entities: this._entities }, nextOptions)
  }

  params = (): ScanCommandInput => {
    const params = scanParams({ table: this._table, entities: this._entities }, this._options)

    return params
  }

  send = async (): Promise<ScanResponse<ENTITIES>> => {
    const scanParams = this.params()

    const commandOutput = await this._table.documentClient.send(new _ScanCommand(scanParams))

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
      const itemEntityName = item[this._table.entityAttributeSavedAs] as string

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
      Items: formattedItems as ScanResponse<ENTITIES>['Items'],
      ...restCommandOutput
    }
  }
}

export type ScanCommandClass = typeof ScanCommand
