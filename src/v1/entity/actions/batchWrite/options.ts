import type { CapacityOptions } from 'v1/operations/constants/options/capacity'
import type { MetricsOptions } from 'v1/operations/constants/options/metrics'

export interface BatchWriteOptions extends CapacityOptions, MetricsOptions {}
