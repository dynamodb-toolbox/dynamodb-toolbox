import isEmpty from 'lodash.isempty'

import type { EntityV2 } from 'v1/entity'
import { parseProjection } from 'v1/operations/expression/projection/parse'
import { rejectExtraOptions } from 'v1/operations/utils/parseOptions/rejectExtraOptions'

import type { GetItemTransactionOptions } from '../options'
import type { TransactGetItemParams } from './transactGetItemParams'

type TransactionOptions = Omit<TransactGetItemParams, 'TableName' | 'Key'>

export const parseGetItemTransactionOptions = <ENTITY extends EntityV2>(
  entity: ENTITY,
  GetItemTransactionOptions: GetItemTransactionOptions<ENTITY>
): TransactionOptions => {
  const transactionOptions: TransactionOptions = {}

  const { attributes, ...extraOptions } = GetItemTransactionOptions

  rejectExtraOptions(extraOptions)

  if (attributes !== undefined) {
    const { ExpressionAttributeNames, ProjectionExpression } = parseProjection(entity, attributes)

    if (!isEmpty(ExpressionAttributeNames)) {
      transactionOptions.ExpressionAttributeNames = ExpressionAttributeNames
    }

    transactionOptions.ProjectionExpression = ProjectionExpression
  }

  return transactionOptions
}
