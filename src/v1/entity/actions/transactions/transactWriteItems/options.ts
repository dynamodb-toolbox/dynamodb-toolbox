import { CapacityOption } from 'v1/options/capacity.js'
import { ClientRequestToken } from 'v1/options/clientRequestToken.js'
import { MetricsOption } from 'v1/options/metrics.js'

/** Top-level options of a transactWrite option */
export interface TransactWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}
