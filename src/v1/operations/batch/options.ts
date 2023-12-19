import type { CapacityOption } from 'v1/operations/constants/options/capacity'
import type { MetricsOption } from 'v1/operations/constants/options/metrics'

export interface BatchWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
}
