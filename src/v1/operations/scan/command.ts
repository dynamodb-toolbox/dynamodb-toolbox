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
import type { Schema } from 'v1/schema'
import type { CountSelectOption } from 'v1/operations/constants/options/select'
import type { EntityPaths } from 'v1/operations/paths'
import { Formatter } from 'v1/schema/actions/format'
import { isString } from 'v1/utils/validation'

import { TableCommand, $table, $entities } from '../class'
import type { ScanOptions } from './options'
import { scanParams } from './scanParams'

const $options = Symbol('$options')
type $options = typeof $options

type ReturnedItems<
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES>
> = OPTIONS['select'] extends CountSelectOption
  ? undefined
  : (EntityV2[] extends ENTITIES
      ? FormattedItem
      : ENTITIES[number] extends infer ENTITY
      ? ENTITY extends EntityV2
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
  TABLE extends TableV2,
  ENTITIES extends EntityV2[],
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
  ENTITIES extends EntityV2[] = EntityV2[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>
> extends TableCommand<TABLE, ENTITIES> {
  static operationName = 'scan' as const;

  [$options]: OPTIONS

  constructor(
    table: TABLE,
    entities = ([] as unknown) as ENTITIES,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$options] = options
  }

  entities<NEXT_ENTITIES extends EntityV2[]>(
    ...nextEntities: NEXT_ENTITIES
  ): ScanCommand<TABLE, NEXT_ENTITIES, ScanOptions<TABLE, NEXT_ENTITIES>> {
    return new ScanCommand<TABLE, NEXT_ENTITIES, ScanOptions<TABLE, NEXT_ENTITIES>>(
      this[$table],
      nextEntities,
      // For some reason we can't do the same as Query (cast OPTIONS) as it triggers an infinite type compute
      this[$options] as ScanOptions<TABLE, NEXT_ENTITIES>
    )
  }

  options<NEXT_OPTIONS extends ScanOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS
  ): ScanCommand<TABLE, ENTITIES, NEXT_OPTIONS> {
    return new ScanCommand(this[$table], this[$entities], nextOptions)
  }

  params = (): ScanCommandInput => scanParams(this[$table], this[$entities], this[$options])

  send = async (): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> => {
    const scanParams = this.params()

    const formattersByName: Record<string, Formatter<Schema>> = {}
    this[$entities].forEach(entity => {
      formattersByName[entity.name] = entity.schema.build(Formatter)
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
      } = await this[$table].documentClient.send(new _ScanCommand(pageScanParams))

      for (const item of items) {
        const itemEntityName = item[this[$table].entityAttributeSavedAs]

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
