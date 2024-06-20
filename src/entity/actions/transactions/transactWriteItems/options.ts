import { CapacityOption } from '~/options/capacity.js'
import { ClientRequestToken } from '~/options/clientRequestToken.js'
import { MetricsOption } from '~/options/metrics.js'

/** Top-level options of a transactWrite option */
export interface TransactWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}
