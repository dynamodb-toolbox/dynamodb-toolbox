import type { CapacityOption } from '~/options/capacity.js'
import type { ClientRequestToken } from '~/options/clientRequestToken.js'
import type { MetricsOption } from '~/options/metrics.js'

/** Top-level options of a transactWrite option */
export interface TransactWriteOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  clientRequestToken?: ClientRequestToken
}
