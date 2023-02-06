import type { CapacityOption } from '../options'

export type NoneMetricsOption = 'NONE'
export type SizeMetricsOption = 'SIZE'
export type MetricsOption = NoneMetricsOption | SizeMetricsOption

export const metricsOptionsSet = new Set<MetricsOption>(['NONE', 'SIZE'])

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
