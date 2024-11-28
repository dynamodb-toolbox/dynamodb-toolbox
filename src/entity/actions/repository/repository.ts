import type { NativeAttributeValue } from '@aws-sdk/util-dynamodb'

import { BatchDeleteRequest } from '~/entity/actions/batchDelete/index.js'
import { BatchGetRequest } from '~/entity/actions/batchGet/index.js'
import { BatchPutRequest } from '~/entity/actions/batchPut/index.js'
import type { DeleteItemOptions, DeleteItemResponse } from '~/entity/actions/delete/index.js'
import { DeleteItemCommand } from '~/entity/actions/delete/index.js'
import type { FormatItemOptions, InferReadItemOptions } from '~/entity/actions/format/index.js'
import { EntityFormatter } from '~/entity/actions/format/index.js'
import type { GetItemOptions, GetItemResponse } from '~/entity/actions/get/index.js'
import { GetItemCommand } from '~/entity/actions/get/index.js'
import type { InferWriteItemOptions, ParseItemOptions } from '~/entity/actions/parse/index.js'
import { EntityParser } from '~/entity/actions/parse/index.js'
import type { Condition } from '~/entity/actions/parseCondition/index.js'
import { EntityConditionParser } from '~/entity/actions/parseCondition/index.js'
import type { EntityPaths } from '~/entity/actions/parsePaths/index.js'
import { EntityPathParser } from '~/entity/actions/parsePaths/index.js'
import type { PutItemInput, PutItemOptions, PutItemResponse } from '~/entity/actions/put/index.js'
import { PutItemCommand } from '~/entity/actions/put/index.js'
import type { ConditionCheckOptions } from '~/entity/actions/transactCheck/index.js'
import { ConditionCheck } from '~/entity/actions/transactCheck/index.js'
import type { DeleteTransactionOptions } from '~/entity/actions/transactDelete/index.js'
import { DeleteTransaction } from '~/entity/actions/transactDelete/index.js'
import type { GetTransactionOptions } from '~/entity/actions/transactGet/index.js'
import { GetTransaction } from '~/entity/actions/transactGet/index.js'
import { execute as executeTransactGet } from '~/entity/actions/transactGet/index.js'
import type {
  ExecuteTransactGetInput,
  ExecuteTransactGetResponses
} from '~/entity/actions/transactGet/index.js'
import type { PutTransactionOptions } from '~/entity/actions/transactPut/index.js'
import { PutTransaction } from '~/entity/actions/transactPut/index.js'
import type { UpdateTransactionOptions } from '~/entity/actions/transactUpdate/index.js'
import { UpdateTransaction } from '~/entity/actions/transactUpdate/index.js'
import type {
  ExecuteTransactWriteInput,
  ExecuteTransactWriteResponses
} from '~/entity/actions/transactWrite/index.js'
import { execute as executeTransactWrite } from '~/entity/actions/transactWrite/index.js'
import type {
  UpdateItemInput,
  UpdateItemOptions,
  UpdateItemResponse
} from '~/entity/actions/update/index.js'
import { UpdateItemCommand } from '~/entity/actions/update/index.js'
import type {
  UpdateAttributesInput,
  UpdateAttributesOptions,
  UpdateAttributesResponse
} from '~/entity/actions/updateAttributes/index.js'
import { UpdateAttributesCommand } from '~/entity/actions/updateAttributes/index.js'
import type { Entity } from '~/entity/entity.js'
import type {
  FormattedItem,
  InputItem,
  KeyInputItem,
  TransformedItem,
  ValidItem
} from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import type { PrimaryKey } from '~/table/actions/parsePrimaryKey/index.js'

export class EntityRepository<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName = 'repository' as const

  async put<OPTIONS extends PutItemOptions<ENTITY> = PutItemOptions<ENTITY>>(
    item: PutItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): Promise<PutItemResponse<ENTITY, OPTIONS>> {
    return new PutItemCommand(this.entity, item, options).send()
  }

  async get<OPTIONS extends GetItemOptions<ENTITY> = GetItemOptions<ENTITY>>(
    key: KeyInputItem<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): Promise<GetItemResponse<ENTITY, OPTIONS>> {
    return new GetItemCommand(this.entity, key, options).send()
  }

  async update<OPTIONS extends UpdateItemOptions<ENTITY> = UpdateItemOptions<ENTITY>>(
    item: UpdateItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): Promise<UpdateItemResponse<ENTITY, OPTIONS>> {
    return new UpdateItemCommand(this.entity, item, options).send()
  }

  async updateAttributes<
    OPTIONS extends UpdateAttributesOptions<ENTITY> = UpdateAttributesOptions<ENTITY>
  >(
    item: UpdateAttributesInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): Promise<UpdateAttributesResponse<ENTITY, OPTIONS>> {
    return new UpdateAttributesCommand(this.entity, item, options).send()
  }

  async delete<OPTIONS extends DeleteItemOptions<ENTITY> = DeleteItemOptions<ENTITY>>(
    key: KeyInputItem<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): Promise<DeleteItemResponse<ENTITY, OPTIONS>> {
    return new DeleteItemCommand(this.entity, key, options).send()
  }

  batchGet(key: KeyInputItem<ENTITY>): BatchGetRequest<ENTITY> {
    return new BatchGetRequest(this.entity, key)
  }

  batchPut(item: InputItem<ENTITY>): BatchPutRequest<ENTITY> {
    return new BatchPutRequest(this.entity, item)
  }

  batchDelete(key: KeyInputItem<ENTITY>): BatchDeleteRequest<ENTITY> {
    return new BatchDeleteRequest(this.entity, key)
  }

  static executeTransactGet<TRANSACTIONS extends ExecuteTransactGetInput>(
    ...transactions: TRANSACTIONS
  ): Promise<ExecuteTransactGetResponses<TRANSACTIONS>> {
    return executeTransactGet<TRANSACTIONS>(...transactions)
  }

  transactGet<OPTIONS extends GetTransactionOptions<ENTITY> = GetTransactionOptions<ENTITY>>(
    key: KeyInputItem<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): GetTransaction<ENTITY> {
    return new GetTransaction(this.entity, key, options)
  }

  static executeTransactWrite<TRANSACTIONS extends ExecuteTransactWriteInput>(
    ...transactions: TRANSACTIONS
  ): Promise<ExecuteTransactWriteResponses<TRANSACTIONS>> {
    return executeTransactWrite<TRANSACTIONS>(...transactions)
  }

  transactPut<OPTIONS extends PutTransactionOptions<ENTITY> = PutTransactionOptions<ENTITY>>(
    item: PutItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): PutTransaction<ENTITY, OPTIONS> {
    return new PutTransaction(this.entity, item, options)
  }

  transactUpdate<
    OPTIONS extends UpdateTransactionOptions<ENTITY> = UpdateTransactionOptions<ENTITY>
  >(
    item: UpdateItemInput<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): UpdateTransaction<ENTITY, OPTIONS> {
    return new UpdateTransaction(this.entity, item, options)
  }

  transactDelete<
    OPTIONS extends DeleteTransactionOptions<ENTITY> = DeleteTransactionOptions<ENTITY>
  >(
    key: KeyInputItem<ENTITY>,
    options: OPTIONS = {} as OPTIONS
  ): DeleteTransaction<ENTITY, OPTIONS> {
    return new DeleteTransaction(this.entity, key, options)
  }

  transactCheck(
    key: KeyInputItem<ENTITY>,
    condition: Condition<ENTITY>,
    options: ConditionCheckOptions = {}
  ): ConditionCheck<ENTITY> {
    return new ConditionCheck(this.entity, key, condition, options)
  }

  parse<OPTIONS extends ParseItemOptions = {}>(
    item: { [KEY: string]: unknown },
    options: OPTIONS = {} as OPTIONS
  ): {
    parsedItem: ValidItem<ENTITY, InferWriteItemOptions<OPTIONS>>
    item: TransformedItem<ENTITY, InferWriteItemOptions<OPTIONS>> & PrimaryKey<ENTITY['table']>
    key: PrimaryKey<ENTITY['table']>
  } {
    return new EntityParser(this.entity).parse(item, options)
  }

  parseCondition(
    condition: Condition<ENTITY>,
    id: string = ''
  ): {
    ConditionExpression: string
    ExpressionAttributeNames: Record<string, string>
    ExpressionAttributeValues: Record<string, NativeAttributeValue>
  } {
    return new EntityConditionParser(this.entity, id).parse(condition).toCommandOptions()
  }

  parsePaths(
    attributes: EntityPaths<ENTITY>[],
    id: string = ''
  ): {
    ProjectionExpression: string
    ExpressionAttributeNames: Record<string, string>
  } {
    return new EntityPathParser(this.entity, id).parse(attributes).toCommandOptions()
  }

  format<OPTIONS extends FormatItemOptions<ENTITY> = {}>(
    item: { [KEY: string]: unknown },
    options: OPTIONS = {} as OPTIONS
  ): FormattedItem<ENTITY, InferReadItemOptions<ENTITY, OPTIONS>> {
    return new EntityFormatter(this.entity).format(item, options)
  }
}
