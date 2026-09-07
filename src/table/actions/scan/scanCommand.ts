import type { ConsumedCapacity } from '@aws-sdk/client-dynamodb'
import { ScanCommand as _ScanCommand } from '@aws-sdk/lib-dynamodb'
import type { ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import type { FormattedItem } from '~/entity/index.js'
import type { Entity } from '~/entity/index.js'
import { getEntityAttrOptionValue, isEntityAttrEnabled } from '~/entity/utils/index.js'
import type { EntityAttrObjectOptions, EntityAttrOptionValue } from '~/entity/utils/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { CountSelectOption } from '~/options/select.js'
import { $sentArgs } from '~/table/constants.js'
import { interceptable } from '~/table/decorator.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table, TableSendableAction } from '~/table/table.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
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
          ? [ENTITY, OPTIONS] extends [
              { entityAttribute: true | EntityAttrObjectOptions },
              { showEntityAttr: true }
            ]
            ? Merge<
                FormattedItem<
                  ENTITY,
                  {
                    attributes: OPTIONS extends { attributes: string[] }
                      ? Extract<OPTIONS['attributes'][number], EntityPaths<ENTITY>>
                      : undefined
                  }
                >,
                {
                  [KEY in EntityAttrOptionValue<
                    ENTITY['entityAttribute'],
                    'name'
                  >]: ENTITY['entityName']
                }
              >
            : FormattedItem<
                ENTITY,
                {
                  attributes: OPTIONS extends { attributes: string[] }
                    ? Extract<OPTIONS['attributes'][number], EntityPaths<ENTITY>>
                    : undefined
                }
              >
          : never
        : never)[]

/** Response returned by a `ScanCommand`: the DynamoDB output with `Items` formatted per matching entity. */
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

/** Internal `ScanCommand` implementation exposing `send`, `params` and `paginate`. */
export class IScanCommand<
    TABLE extends Table = Table,
    ENTITIES extends Entity[] = Entity[],
    OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>
  >
  extends TableAction<TABLE, ENTITIES>
  implements TableSendableAction<TABLE>
{
  static override actionName = 'scan' as const;

  [$options]: OPTIONS

  /** Bind the command to a table, entities and options. */
  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities)
    this[$options] = options
  }

  /** Return the arguments sent to DynamoDB. */
  [$sentArgs](): [Entity[], ScanOptions<TABLE, Entity[]>] {
    return [
      this[$entities],
      /**
       * @debt type "Make any ScanOptions<...> instance extend base ScanOptions"
       */
      this[$options] as ScanOptions<TABLE, Entity[]>
    ]
  }

  /** Build the raw AWS SDK `ScanCommandInput`. */
  params(): ScanCommandInput {
    return scanParams(this.table, ...this[$sentArgs]())
  }

  /** Run the scan, auto-paginating up to `maxPages`, and return items formatted per entity. */
  @interceptable()
  async send(
    documentClientOptions?: DocumentClientOptions
  ): Promise<ScanResponse<TABLE, ENTITIES, OPTIONS>> {
    const entityAttrSavedAs = this.table.entityAttributeSavedAs
    const scanParams = this.params()

    const formattersByName: Record<string, EntityFormatter> = {}
    this[$entities].forEach(entity => {
      formattersByName[entity.entityName] = entity.build(EntityFormatter)
    })

    const formattedItems: FormattedItem[] = []
    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let consumedCapacity: ConsumedCapacity | undefined = undefined
    let responseMetadata: ScanCommandOutput['$metadata'] | undefined = undefined

    // NOTE: maxPages has been validated by this.params()
    const {
      attributes,
      maxPages = 1,
      showEntityAttr = false,
      noEntityMatchBehavior = 'THROW'
    } = this[$options]

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
      } = await this.table
        .getDocumentClient()
        .send(new _ScanCommand(pageScanParams), documentClientOptions)

      for (const item of items) {
        if (this[$entities].length === 0) {
          formattedItems.push(item)
          continue
        }

        const itemEntityName = item[entityAttrSavedAs]
        const itemEntityFormatter = isString(itemEntityName)
          ? formattersByName[itemEntityName]
          : undefined

        if (itemEntityFormatter === undefined) {
          let hasEntityMatch: boolean = false

          // If data doesn't contain entity name (e.g. migrating to DynamoDB-Toolbox), we try all formatters
          // (NOTE: Can only happen if `entityAttrFilter` is false)
          for (const [entityName, formatter] of Object.entries(formattersByName)) {
            try {
              const formattedItem = formatter.format(item, { attributes })

              const { entityAttribute } = formatter.entity
              const entityAttrName = getEntityAttrOptionValue(entityAttribute, 'name')
              const addEntityAttr = showEntityAttr && isEntityAttrEnabled(entityAttribute)

              formattedItems.push({
                ...formattedItem,
                ...(addEntityAttr ? { [entityAttrName]: entityName } : {})
              })

              hasEntityMatch = true
              break
            } catch {
              continue
            }
          }

          if (!hasEntityMatch && noEntityMatchBehavior === 'THROW') {
            throw new DynamoDBToolboxError('scanCommand.noEntityMatched', {
              message: 'Unable to match item of unidentified entity to the ScanCommand entities',
              payload: { item }
            })
          }

          continue
        }

        const formattedItem = itemEntityFormatter.format(item, { attributes })

        const { entityAttribute, entityName } = itemEntityFormatter.entity
        const entityAttrName = getEntityAttrOptionValue(entityAttribute, 'name')
        const addEntityAttr = showEntityAttr && isEntityAttrEnabled(entityAttribute)

        formattedItems.push({
          ...formattedItem,
          ...(addEntityAttr ? { [entityAttrName]: entityName } : {})
        })
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

  /** Lazily yield scan response pages as an async iterator. */
  async *paginate(
    documentClientOptions?: DocumentClientOptions
  ): AsyncIterableIterator<ScanResponse<TABLE, ENTITIES, OPTIONS>> {
    let page = await this.send(documentClientOptions)
    yield page

    let exclusiveStartKey = page.LastEvaluatedKey
    while (exclusiveStartKey !== undefined) {
      const command = new IScanCommand(this.table, this[$entities], {
        ...this[$options],
        exclusiveStartKey
      } as OPTIONS)

      page = await command.send(documentClientOptions)
      yield page

      exclusiveStartKey = page.LastEvaluatedKey
    }
  }
}

/** Scan the whole table or a secondary index, formatting matched items per entity. */
export class ScanCommand<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  OPTIONS extends ScanOptions<TABLE, ENTITIES> = ScanOptions<TABLE, ENTITIES>
> extends IScanCommand<TABLE, ENTITIES, OPTIONS> {
  /** Bind the command to a table, entities and options. */
  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    options: OPTIONS = {} as OPTIONS
  ) {
    super(table, entities, options)
  }

  /** Set the entities the scan spans (narrows and types returned items). */
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

  /** Set the command options, or derive them from the previous ones. */
  options<NEXT_OPTIONS extends ScanOptions<TABLE, ENTITIES>>(
    nextOptions: NEXT_OPTIONS | ((prevOptions: OPTIONS) => NEXT_OPTIONS)
  ): ScanCommand<TABLE, ENTITIES, NEXT_OPTIONS> {
    return new ScanCommand(
      this.table,
      this[$entities],
      typeof nextOptions === 'function' ? nextOptions(this[$options]) : nextOptions
    )
  }
}
