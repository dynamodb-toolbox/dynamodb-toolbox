import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall as dynamodbMarshall } from '@aws-sdk/util-dynamodb'

import { PossiblyUndefinedResolvedItem } from 'v1/item'

export const marshall = (item: PossiblyUndefinedResolvedItem): Record<string, AttributeValue> =>
  dynamodbMarshall(item, {
    convertEmptyValues: false,
    removeUndefinedValues: true,
    convertClassInstanceToMap: false
  })
