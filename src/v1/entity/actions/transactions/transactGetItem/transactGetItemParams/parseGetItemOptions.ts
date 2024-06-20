import { isEmpty } from 'lodash'

import type { EntityV2 } from 'v1/entity/index.js'
import { EntityPathParser } from 'v1/entity/actions/parsePaths.js'
import { rejectExtraOptions } from 'v1/options/rejectExtraOptions.js'

import type { GetItemTransactionOptions } from '../options.js'
import type { TransactGetItemParams } from './transactGetItemParams.js'

type TransactionOptions = Omit<TransactGetItemParams, 'TableName' | 'Key'>

export const parseGetItemTransactionOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  GetItemTransactionOptions: GetItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const transactionOptions: TransactionOptions = {}

  const { attributes, ...extraOptions } = GetItemTransactionOptions

  rejectExtraOptions(extraOptions)

  if (attributes !== undefined) {
    const { ExpressionAttributeNames, ProjectionExpression } = entity
      .build(EntityPathParser)
      .parse(attributes)
      .toCommandOptions()

    if (!isEmpty(ExpressionAttributeNames)) {
      transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    transactionOptions.ProjectionExpression = ProjectionExpression
  }

  return transactionOptions
}
