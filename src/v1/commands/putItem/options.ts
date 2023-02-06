export type None = 'NONE'
export type Total = 'TOTAL'
export type Indexes = 'INDEXES'

export type CapacityOption = None | Total | Indexes

export const capacityOptionsSet = new Set<CapacityOption>(['NONE', 'TOTAL', 'INDEXES'])

export type Size = 'SIZE'
export type MetricsOption = None | Size

export const metricsOptionsSet = new Set<MetricsOption>(['NONE', 'SIZE'])

export interface PutItemOptions {
  capacity?: CapacityOption
  metrics?: MetricsOption
}
