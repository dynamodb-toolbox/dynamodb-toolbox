import type { AttributeValue } from '@aws-sdk/client-dynamodb'
import { marshall as dynamodbMarshall } from '@aws-sdk/util-dynamodb'

import { PossiblyUndefinedResolvedItem } from 'v1/item'

import { filterUndefinedValues } from './filterUndefinedValues'

export const marshall = (item: PossiblyUndefinedResolvedItem): Record<string, AttributeValue> =>
  dynamodbMarshall(filterUndefinedValues(item))
