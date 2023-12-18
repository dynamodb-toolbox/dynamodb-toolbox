import type { BatchWriteCommandInput } from '@aws-sdk/lib-dynamodb'

import type { EntityV2 } from 'v1/entity'
import { EntityOperation } from 'v1/operations/class'

type BatchWriteRequestInputRecord = NonNullable<
  BatchWriteCommandInput['RequestItems']
>[string][number]

export type RequestTypes = keyof BatchWriteRequestInputRecord

export type BatchWriteItemRequestInput<REQUEST_TYPE extends RequestTypes> = NonNullable<
  BatchWriteRequestInputRecord[REQUEST_TYPE]
>

export interface BatchWriteRequestInterface<
  ENTITY extends EntityV2 = EntityV2,
  REQUEST_TYPE extends RequestTypes = RequestTypes
> extends EntityOperation<ENTITY> {
  params: () => BatchWriteItemRequestInput<REQUEST_TYPE>
  requestType: REQUEST_TYPE
}
