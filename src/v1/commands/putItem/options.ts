import type { CapacityOption } from 'v1/commands/constants/options/capacity'
import type { MetricsOption } from 'v1/commands/constants/options/metrics'

export type NoneReturnValuesOption = 'NONE'
export type AllOldReturnValuesOption = 'ALL_OLD'
export type UpdatedOldReturnValuesOption = 'UPDATED_OLD'
export type AllNewReturnValuesOption = 'ALL_NEW'
export type UpdatedNewReturnValuesOption = 'UPDATED_NEW'
export type ReturnValuesOption =
  | NoneReturnValuesOption
  | AllOldReturnValuesOption
  | UpdatedOldReturnValuesOption
  | AllNewReturnValuesOption
  | UpdatedNewReturnValuesOption

export const returnValuesOptionsSet = new Set<ReturnValuesOption>([
  'NONE',
  'ALL_OLD',
  'UPDATED_OLD',
  'ALL_NEW',
  'UPDATED_NEW'
])

export interface PutItemOptions<RETURN_VALUES extends ReturnValuesOption = ReturnValuesOption> {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: RETURN_VALUES
}
