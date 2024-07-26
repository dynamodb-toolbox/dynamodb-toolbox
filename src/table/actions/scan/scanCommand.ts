import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import { ScanCommand as _ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { FormattedItem } from '~/entity/actions/format/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { Entity } from '~/entity/index.js'
import type { CountSelectOption } from '~/options/select.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table } from '~/table/index.js'
import type { Merge } from '~/types/merge.js'
import { isString } from '~/utils/validation/isString.js'

import { $options } from './constants.js'
import type { ScanOptions } from './options.js'
import { scanParams } from './scanParams/index.js'

type ReturnedItems<
  TABLE extends Table,
  ENTITIES extends Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (Entity[] extends ENTITIES
      ? FormattedItem
      : ENTITIES[number] extends infer ENTITY
        ? ENTITY extends Entity
          ? FormattedItem<
              ENTITY,
              {
                attributes: OPTIONS['attributes'] extends EntityPaths<ENTITY>[]
                  ? OPTIONS['attributes'][number]
                  : undefined
              }
            >
          : never
        : never)[]

export type ScanResponse<
  TABLE extends Table,
  ENTITIES extends Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
> = Merge<
  Omit<ScanCommandOutput, 'Items' | '$metadata'>,
  {
    Items?: ReturnedItems<TABLE, ENTITIES, OPTIONS>
    // $metadata is not returned on multiple page queries
    $metadata?: ScanCommandOutput['$metadata']
  }
>

export class ScanCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>
> extends TableAction<TABLE, ENTITIES> {
  static actionName = 'scan' as const;

  [$options]: OPTIONS

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$options] = options
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): ScanCommand<TABLE, NEXT_ENTITIES, ScanOptions<TABLE, NEXT_ENTITIES>> {
    return new ScanCommand<TABLE, NEXT_ENTITIES, ScanOptions<TABLE, NEXT_ENTITIES>>(
      this.table,
      nextEntities,
      // For some reason we can't do the same as Query (cast OPTIONS) as it triggers an infinite type compute
      this[$options] as ScanOptions<TABLE, NEXT_ENTITIES>
    )
  }

  options<NEXT_OPTIONS extends ScanOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ): ScanCommand<TABLE, ENTITIES, NEXT_OPTIONS> {
    return new ScanCommand(this.table, this[$entities], nextOptions)
  }

  params = (): ScanCommandInput => scanParams(this.table, this[$entities], this[$options])

  send = async (): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> => {
    const scanParams = this.params()

    const formattersByName: Record<string, EntityFormatter> = {}
    this[$entities].forEach(entity => {
      formattersByName[entity.name] = entity.build(EntityFormatter)
    })

    const formattedItems: FormattedItem[] = []
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let consumedCapacity: ConsumedCapacity | undefined = undefined
    let responseMetadata: ScanCommandOutput['$metadata'] | undefined = undefined

    // NOTE: maxPages has been validated by this.params()
    const { attributes, maxPages = 1 } = this[$options]
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
      } = await this.table.getDocumentClient().send(new _ScanCommand(pageScanParams))

      for (const item of items) {
        const itemEntityName = item[this.table.entityAttributeSavedAs]

        if (!isString(itemEntityName)) {
          continue
        }

        const formatter = formattersByName[itemEntityName]

        if (formatter === undefined) {
          if (this[$entities].length === 0) {
            formattedItems.push(item)
          }
          continue
        }

        formattedItems.push(formatter.format(item, { attributes }))
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
