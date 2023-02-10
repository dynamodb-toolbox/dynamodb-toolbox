import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { MetricsOption } from 'v1/commands/constants/options/metrics'
import type { ReturnValuesOption } from 'v1/commands/constants/options/returnValues'

export type PutItemCommandReturnValuesOption = ReturnValuesOption

export const putItemCommandReturnValuesOptionsSet = new Set<PutItemCommandReturnValuesOption>([
  'NONE',
  'ALL_OLD',
  'UPDATED_OLD',
  'ALL_NEW',
  'UPDATED_NEW'
])

export interface PutItemOptions<
  RETURN_VALUES extends PutItemCommandReturnValuesOption = PutItemCommandReturnValuesOption
> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: RETURN_VALUES
}
