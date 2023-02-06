export type None = 'NONE'
export type Total = 'TOTAL'
export type Indexes = 'INDEXES'

export type CapacityOption = None | Total | Indexes

export const capacityOptionsSet = new Set<CapacityOption>(['NONE', 'TOTAL', 'INDEXES'])

export type Size = 'SIZE'
export type MetricsOption = None | Size

export const metricsOptionsSet = new Set<MetricsOption>(['NONE', 'SIZE'])

export type AllOld = 'ALL_OLD'
export type UpdatedOld = 'UPDATED_OLD'
export type AllNew = 'ALL_NEW'
export type UpdatedNew = 'UPDATED_NEW'
export type ReturnValuesOption = None | AllOld | UpdatedOld | AllNew | UpdatedNew

export const returnValuesOptionsSet = new Set<ReturnValuesOption>([
  'NONE',
  'ALL_OLD',
  'UPDATED_OLD',
  'ALL_NEW',
  'UPDATED_NEW'
])

export interface PutItemOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
  returnValues?: ReturnValuesOption
}
