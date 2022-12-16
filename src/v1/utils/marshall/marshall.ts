import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall as dynamodbMarshall } from '@aws-sdk/util-dynamodb'

import { PossiblyUndefinedResolvedAttribute } from 'v1/item'

import { filterUndefinedValues } from './filterUndefinedValues'

export const marshall = <
  ITEM extends {
    [key: string]: PossiblyUndefinedResolvedAttribute
  }
>(
  item: ITEM
): Record<string, AttributeValue> => dynamodbMarshall(filterUndefinedValues(item))
