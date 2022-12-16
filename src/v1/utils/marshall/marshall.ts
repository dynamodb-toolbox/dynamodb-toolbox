import { marshall as dynamodbMarshall } from '@aws-sdk/util-dynamodb'

import { ResolvedAttribute } from 'v1/item'

import { filterUndefinedValues } from './filterUndefinedValues'

export const marshall = <
  ITEM extends {
    [key: string]: ResolvedAttribute
  }
>(
  item: ITEM
) => dynamodbMarshall(filterUndefinedValues(item))
