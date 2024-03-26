import { CapacityOptions } from 'v1/operations/constants/options/capacity'
import { ClientRequestTokenOptions } from 'v1/operations/constants/options/clientRequestToken'
import { MetricsOptions } from 'v1/operations/constants/options/metrics'

/** Top-level options of a transactWrite option */
export interface TransactWriteOptions
  extends CapacityOptions,
    MetricsOptions,
    ClientRequestTokenOptions {}
