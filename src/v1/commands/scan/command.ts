import type { O } from 'ts-toolbelt'
import {
  ScanCommandInput,
  ScanCommand as _ScanCommand,
  ScanCommandOutput
} from '@aws-sdk/lib-dynamodb'
import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import type { TableV2 } from 'v1/table'
import type { EntityV2, FormattedItem } from 'v1/entity'
import type { Item } from 'v1/schema'
import type { CountSelectOption } from 'v1/commands/constants/options/select'
import { formatSavedItem } from 'v1/commands/utils/formatSavedItem'
import { isString } from 'v1/utils/validation'

import { TableCommand } from '../class'
import type { ScanOptions } from './options'
import { scanParams } from './scanParams'

type ReturnedItems<
  TABLE extends TableV2,
  ENTITIES extends EntityV2,
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (EntityV2 extends ENTITIES
      ? Item
      : ENTITIES extends infer ENTITY
      ? ENTITY extends EntityV2
        ? FormattedItem<ENTITY>
        : never
      : never)[]

export type ScanResponse<
  TABLE extends TableV2,
  ENTITIES extends EntityV2,
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
> = O.Merge<
  Omit<ScanCommandOutput, 'Items' | '$metadata'>,
  {
    Items?: ReturnedItems<TABLE, ENTITIES, OPTIONS>
    // $metadata is not returned on multiple page queries
    $metadata?: ScanCommandOutput['$metadata']
  }
>

export class ScanCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2 = EntityV2,
  OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>
> extends TableCommand<TABLE, ENTITIES> {
  static commandName = 'scan' as const

  public entities: <NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ) => ScanCommand<
    TABLE,
    NEXT_ENTITIES[number],
    OPTIONS extends ScanOptions<TABLE, NEXT_ENTITIES[number]>
      ? OPTIONS
      : ScanOptions<TABLE, NEXT_ENTITIES[number]>
  >
  private _options: OPTIONS
  public options: <NEXT_OPTIONS extends ScanOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ) => ScanCommand<TABLE, ENTITIES, NEXT_OPTIONS>

  constructor(args: { table: TABLE; entities?: ENTITIES[] }, options: OPTIONS = {} as OPTIONS) {
    super(args)
    this._options = options

    this.entities = <NEXT_ENTITIES extends EntityV2[]>(...nextEntities: NEXT_ENTITIES) =>
      new ScanCommand<
        TABLE,
        NEXT_ENTITIES[number],
        OPTIONS extends ScanOptions<TABLE, NEXT_ENTITIES[number]>
          ? OPTIONS
          : ScanOptions<TABLE, NEXT_ENTITIES[number]>
      >(
        {
          table: this._table,
          entities: nextEntities
        },
        this._options as OPTIONS extends ScanOptions<TABLE, NEXT_ENTITIES[number]>
          ? OPTIONS
          : ScanOptions<TABLE, NEXT_ENTITIES[number]>
      )
    this.options = nextOptions =>
      new ScanCommand({ table: this._table, entities: this._entities }, nextOptions)
  }

  params = (): ScanCommandInput =>
    scanParams({ table: this._table, entities: this._entities }, this._options)

  send = async (): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> => {
    const scanParams = this.params()

    const entities = this._entities ?? []
    const entitiesByName: Record<string, EntityV2> = {}
    entities.forEach(entity => {
      entitiesByName[entity.name] = entity
    })

    const formattedItems: Item[] = []
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let consumedCapacity: ConsumedCapacity | undefined = undefined
    let responseMetadata: ScanCommandOutput['$metadata'] | undefined = undefined

    // NOTE: maxPages has been validated by this.params()
    const { maxPages = 1 } = this._options
    let pageIndex = 0
    do {
      pageIndex += 1

      const pageScanParams: ScanCommandInput = {
        ...scanParams,
        // NOTE: Important NOT to override initial exclusiveStartKey on first page
        ...(lastEvaluatedKey !== undefined ? { ExclusiveStartKey: lastEvaluatedKey } : {})
      }

      const {
        Items: items = [],
        LastEvaluatedKey: pageLastEvaluatedKey,
        Count: pageCount,
        ScannedCount: pageScannedCount,
        ConsumedCapacity: pageConsumedCapacity,
        $metadata: pageMetadata
      } = await this._table.documentClient.send(new _ScanCommand(pageScanParams))

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

      lastEvaluatedKey = pageLastEvaluatedKey

      if (count !== undefined) {
        count = pageCount !== undefined ? count + pageCount : undefined
      }

      if (scannedCount !== undefined) {
        scannedCount = pageScannedCount !== undefined ? scannedCount + pageScannedCount : undefined
      }

      consumedCapacity = pageConsumedCapacity
      responseMetadata = pageMetadata
    } while (pageIndex < maxPages && lastEvaluatedKey !== undefined)

    return {
      Items: formattedItems as ScanResponse<TABLE, ENTITIES, OPTIONS>['Items'],
      ...(lastEvaluatedKey !== undefined ? { LastEvaluatedKey: lastEvaluatedKey } : {}),
      ...(count !== undefined ? { Count: count } : {}),
      ...(scannedCount !== undefined ? { ScannedCount: scannedCount } : {}),
      // return ConsumedCapacity & $metadata only if one page has been fetched
      ...(pageIndex === 1
        ? {
            ...(consumedCapacity !== undefined ? { ConsumedCapacity: consumedCapacity } : {}),
            ...(responseMetadata !== undefined ? { $metadata: responseMetadata } : {})
          }
        : {})
    }
  }
}

export type ScanCommandClass = typeof ScanCommand
