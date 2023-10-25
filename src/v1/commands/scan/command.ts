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

import type { TableCommandClass } from '../class'
import type { ScanOptions } from './options'
import { scanParams } from './scanParams'
import { isString } from 'v1/utils/validation'

export type ScanResponse<OPTIONS extends ScanOptions> = O.Merge<
  Omit<ScanCommandOutput, 'Items'>,
  {
    Items?: // TODO: Update Response according to Select option
    | (EntityV2 extends OPTIONS['filteredEntities']
          ? Item
          : OPTIONS['filteredEntities'] extends infer FILTERED_ENTITY
          ? FILTERED_ENTITY extends EntityV2
            ? FormattedItem<FILTERED_ENTITY>
            : never
          : never)[]
      | undefined
  }
>

export class ScanCommand<TABLE extends TableV2 = TableV2, OPTIONS extends ScanOptions = ScanOptions>
  implements TableCommandClass {
  static commandType = 'scan' as const

  public table: TABLE
  public _options: OPTIONS
  public options: <NEXT_OPTIONS extends ScanOptions>(
    nextOptions: NEXT_OPTIONS
  ) => ScanCommand<TABLE, NEXT_OPTIONS>

  constructor(table: TABLE, options: OPTIONS = {} as OPTIONS) {
    this.table = table
    this._options = options

    this.options = nextOptions => new ScanCommand(this.table, nextOptions)
  }

  params = (): ScanCommandInput => {
    const params = scanParams(this.table, this._options)

    return params
  }

  send = async (): Promise<ScanResponse<OPTIONS>> => {
    const scanParams = this.params()

    const commandOutput = await this.table.documentClient.send(new _ScanCommand(scanParams))

    const { Items: items, ...restCommandOutput } = commandOutput

    if (items === undefined) {
      return restCommandOutput
    }

    const { filteredEntities = [] } = this._options
    const filteredEntitiesByName: Record<string, EntityV2> = {}
    filteredEntities.forEach(filteredEntity => {
      filteredEntitiesByName[filteredEntity.name] = filteredEntity
    })

    const formattedItems: Item[] = []

    for (const item of items) {
      const itemEntityName = item[this.table.entityAttributeSavedAs] as string

      if (!isString(itemEntityName)) {
        continue
      }

      const itemEntity = filteredEntitiesByName[itemEntityName]

      if (itemEntity === undefined) {
        continue
      }

      formattedItems.push(formatSavedItem<EntityV2, {}>(itemEntity, item))
    }

    return {
      Items: formattedItems as ScanResponse<OPTIONS>['Items'],
      ...restCommandOutput
    }
  }
}

export type ScanCommandClass = typeof ScanCommand
