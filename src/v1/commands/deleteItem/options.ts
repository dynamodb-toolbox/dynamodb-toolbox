import { CapacityOption } from 'v1/commands/constants/options/capacity'
import { MetricsOption } from 'v1/commands/constants/options/metrics'

export interface DeleteItemOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  // returnValues?: RETURN_VALUES
}
