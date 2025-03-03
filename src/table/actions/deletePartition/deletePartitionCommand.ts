import type {
  BatchWriteCommandOutput,
  QueryCommandInput,
  QueryCommandOutput
} from '@aws-sdk/lib-dynamodb'
import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { BatchDeleteRequest } from '~/entity/actions/batchDelete/batchDeleteRequest.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { BatchWriteCommand, execute } from '~/table/actions/batchWrite/index.js'
import { $entity, QueryCommand } from '~/table/actions/query/index.js'
import type { Query } from '~/table/actions/query/index.js'
import { $sentArgs } from '~/table/constants.js'
import { interceptable } from '~/table/decorator.js'
import { $entities, TableAction } from '~/table/index.js'
import type { Table, TableSendableAction } from '~/table/table.js'
import type { DocumentClientOptions } from '~/types/documentClientOptions.js'
import type { Merge } from '~/types/merge.js'
import { chunk } from '~/utils/chunk.js'

import { $options, $query } from './constants.js'
import type { DeletePartitionOptions } from './options.js'

export type DeletePartitionResponse = Merge<
  Omit<QueryCommandOutput, 'Items' | '$metadata' | 'ConsumedCapacity'>,
  {
    QueryConsumedCapacity?: QueryCommandOutput['ConsumedCapacity']
    BatchWriteConsumedCapacity?: BatchWriteCommandOutput['ConsumedCapacity']
  }
>

export class DeletePartitionCommand<
    TABLE extends Table = Table,
    ENTITIES extends Entity[] = Entity[],
    QUERY extends Query<TABLE> = Query<TABLE>
  >
  extends TableAction<TABLE, ENTITIES>
  implements TableSendableAction<TABLE>
{
  static override actionName = 'deletePartition' as const;

  [$query]?: QUERY;
  [$options]: DeletePartitionOptions<TABLE, ENTITIES, QUERY>

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    query?: QUERY,
    options: DeletePartitionOptions<TABLE, ENTITIES, QUERY> = {}
  ) {
    super(table, entities)
    this[$query] = query
    this[$options] = options
  }

  entities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): DeletePartitionCommand<TABLE, NEXT_ENTITIES, QUERY> {
    return new DeletePartitionCommand(
      this.table,
      nextEntities,
      this[$query],
      this[$options] as DeletePartitionOptions<TABLE, NEXT_ENTITIES, QUERY>
    )
  }

  query<NEXT_QUERY extends Query<TABLE>>(
    nextQuery: NEXT_QUERY
  ): DeletePartitionCommand<TABLE, ENTITIES, NEXT_QUERY> {
    return new DeletePartitionCommand(this.table, this[$entities], nextQuery, this[$options])
  }

  options(
    nextOptions: DeletePartitionOptions<TABLE, ENTITIES, QUERY>
  ): DeletePartitionCommand<TABLE, ENTITIES, QUERY> {
    return new DeletePartitionCommand(this.table, this[$entities], this[$query], nextOptions)
  }

  [$sentArgs](): [Entity[], Query<TABLE>, DeletePartitionOptions<TABLE, Entity[], Query<TABLE>>] {
    if (this[$entities].length === 0) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeletePartitionCommand incomplete: Missing "entities" property'
      })
    }

    if (!this[$query]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'DeletePartitionCommand incomplete: Missing "query" property'
      })
    }

    return [
      this[$entities],
      this[$query],
      /**
       * @debt type "Make any DeletePartitionOptions<...> instance extend base DeletePartitionOptions"
       */
      this[$options] as DeletePartitionOptions<TABLE, Entity[], Query<TABLE>>
    ]
  }

  queryCommand({
    exclusiveStartKey
  }: {
    exclusiveStartKey?: Record<string, NativeAttributeValue> | undefined
  } = {}): QueryCommand<
    TABLE,
    ENTITIES,
    QUERY,
    DeletePartitionOptions<TABLE, ENTITIES, QUERY> & { attributes: undefined }
  > {
    return new QueryCommand(this.table, this[$entities], this[$query], {
      ...this[$options],
      attributes: undefined,
      ...(exclusiveStartKey !== undefined ? { ExclusiveStartKey: exclusiveStartKey } : {}),
      // 1 page <= 1MB and max data of BatchWriteItem is 16MB
      maxPages: 16
    })
  }

  params(): QueryCommandInput {
    return this.queryCommand().params()
  }

  @interceptable()
  async send(documentClientOptions?: DocumentClientOptions): Promise<DeletePartitionResponse> {
    const entitiesByName: Record<string, Entity> = {}
    this[$entities].forEach(entity => {
      entitiesByName[entity.name] = entity
    })

    const { capacity, tableName } = this[$options]

    let lastEvaluatedKey: Record<string, NativeAttributeValue> | undefined = undefined
    let count: number | undefined = 0
    let scannedCount: number | undefined = 0
    let queryConsumedCapacity: QueryCommandOutput['ConsumedCapacity'] = undefined
    let batchWriteConsumedCapacity: BatchWriteCommandOutput['ConsumedCapacity'] = []

    let pageIndex = 0
    do {
      pageIndex += 1

      const {
        Items: items = [],
        Count: pageCount,
        ScannedCount: pageScannedCount,
        ConsumedCapacity: pageQueryConsumedCapacity,
        ...queryOutput
      } = await this.queryCommand({ exclusiveStartKey: lastEvaluatedKey }).send(
        documentClientOptions
      )

      for (const itemChunk of chunk(items, 25)) {
        if (itemChunk.length === 0) {
          continue
        }

        const batchDeleteRequests: BatchDeleteRequest[] = []
        for (const item of itemChunk as ({ [name: string]: unknown } & { [$entity]: string })[]) {
          const entity = entitiesByName[item[$entity]]
          if (entity === undefined) {
            continue
          }

          batchDeleteRequests.push(new BatchDeleteRequest(entity, item))
        }

        // TODO: Merge across pages and return ItemCollectionMetrics
        const { ConsumedCapacity: chunkBatchWriteConsumedCapacity } = await execute(
          { maxAttempts: Infinity, capacity, ...documentClientOptions },
          this.table
            .build(BatchWriteCommand)
            .options({ tableName })
            .requests(...batchDeleteRequests)
        )

        if (chunkBatchWriteConsumedCapacity !== undefined) {
          batchWriteConsumedCapacity?.push(...chunkBatchWriteConsumedCapacity)
        } else {
          batchWriteConsumedCapacity = undefined
        }
      }

      lastEvaluatedKey = queryOutput.LastEvaluatedKey

      if (count !== undefined) {
        count = pageCount !== undefined ? count + pageCount : undefined
      }

      if (scannedCount !== undefined) {
        scannedCount = pageScannedCount !== undefined ? scannedCount + pageScannedCount : undefined
      }

      queryConsumedCapacity = pageQueryConsumedCapacity
    } while (lastEvaluatedKey !== undefined)

    return {
      ...(lastEvaluatedKey !== undefined ? { LastEvaluatedKey: lastEvaluatedKey } : {}),
      ...(count !== undefined ? { Count: count } : {}),
      ...(scannedCount !== undefined ? { ScannedCount: scannedCount } : {}),
      ...(batchWriteConsumedCapacity !== undefined
        ? { BatchWriteConsumedCapacity: batchWriteConsumedCapacity }
        : {}),
      // return ConsumedCapacity only if one page has been fetched
      ...(pageIndex === 1
        ? {
            ...(queryConsumedCapacity !== undefined
              ? { QueryConsumedCapacity: queryConsumedCapacity }
              : {})
          }
        : {})
    }
  }
}
