import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { CapacityOption } from 'v1/options/capacity'
import type { MetricsOption } from 'v1/options/metrics'

export interface BatchWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  documentClient?: DynamoDBDocumentClient
}
