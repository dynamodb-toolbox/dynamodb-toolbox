import { EntityParser } from '~/entity/actions/parse/index.js'
import { expressUpdate } from '~/entity/actions/update/expressUpdate/index.js'
import type { UpdateItemInput } from '~/entity/actions/update/index.js'
import { parseUpdateExtension } from '~/entity/actions/update/updateItemParams/extension/index.js'
import type { Entity } from '~/entity/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { Require } from '~/types/require.js'
import { isEmpty } from '~/utils/isEmpty.js'
import { omit } from '~/utils/omit.js'

import type {
  TransactWriteItem,
  WriteTransactionImplementation
} from '../transactWrite/transaction.js'
import { WriteTransaction } from '../transactWrite/transaction.js'
import { $item, $options } from './constants.js'
import { parseOptions } from './options.js'
import type { UpdateTransactionOptions } from './options.js'

export class UpdateTransaction<
    ENTITY extends Entity = Entity,
    OPTIONS extends UpdateTransactionOptions<ENTITY> = UpdateTransactionOptions<ENTITY>
  >
  extends WriteTransaction<ENTITY>
  implements WriteTransactionImplementation<ENTITY>
{
  static override actionName = 'transactUpdate' as const;

  [$item]?: UpdateItemInput<ENTITY>;
  [$options]: OPTIONS

  constructor(entity: ENTITY, item?: UpdateItemInput<ENTITY>, options: OPTIONS = {} as OPTIONS) {
    super(entity)
    this[$item] = item
    this[$options] = options
  }

  item(nextItem: UpdateItemInput<ENTITY>): UpdateTransaction<ENTITY> {
    return new UpdateTransaction(this.entity, nextItem, this[$options])
  }

  options<NEXT_OPTIONS extends UpdateTransactionOptions<ENTITY>>(
    nextOptions: NEXT_OPTIONS | ((prevOptions: OPTIONS) => NEXT_OPTIONS)
  ): UpdateTransaction<ENTITY, NEXT_OPTIONS> {
    return new UpdateTransaction(
      this.entity,
      this[$item],
      typeof nextOptions === 'function' ? nextOptions(this[$options]) : nextOptions
    )
  }

  params(): Require<TransactWriteItem, 'Update'> & {
    ToolboxItem: UpdateItemInput<ENTITY, { filled: true }>
  } {
    if (!this[$item]) {
      throw new DynamoDBToolboxError('actions.incompleteAction', {
        message: 'UpdateTransaction incomplete: Missing "item" property'
      })
    }

    const { parsedItem, item, key } = this.entity.build(EntityParser).parse(this[$item], {
      mode: 'update',
      parseExtension: parseUpdateExtension
    })

    const {
      ExpressionAttributeNames: updateExpressionAttributeNames,
      ExpressionAttributeValues: updateExpressionAttributeValues,
      UpdateExpression
    } = expressUpdate(this.entity, omit(item, ...Object.keys(key)))

    const options = this[$options]
    const {
      ExpressionAttributeNames: optionsExpressionAttributeNames,
      ExpressionAttributeValues: optionsExpressionAttributeValues,
      ...awsOptions
    } = parseOptions(this.entity, options)

    const ExpressionAttributeNames = {
      ...optionsExpressionAttributeNames,
      ...updateExpressionAttributeNames
    }

    const ExpressionAttributeValues = {
      ...optionsExpressionAttributeValues,
      ...updateExpressionAttributeValues
    }

    return {
      /**
       * @debt type "TODO: Rework extensions & not cast here (use `ParsedItem<ENTITY, { extension: UpdateItemExtension }>`)"
       */
      ToolboxItem: parsedItem as UpdateItemInput<ENTITY, { filled: true }>,
      Update: {
        TableName: options.tableName ?? this.entity.table.getName(),
        Key: key,
        UpdateExpression,
        ...awsOptions,
        ...(!isEmpty(ExpressionAttributeNames) ? { ExpressionAttributeNames } : {}),
        ...(!isEmpty(ExpressionAttributeValues) ? { ExpressionAttributeValues } : {})
      }
    }
  }
}
