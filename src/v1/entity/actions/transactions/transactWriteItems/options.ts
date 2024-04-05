import { CapacityOption } from 'v1/options/capacity'
import { ClientRequestToken } from 'v1/options/clientRequestToken'
import { MetricsOption } from 'v1/options/metrics'

/** Top-level options of a transactWrite option */
export interface TransactWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}
