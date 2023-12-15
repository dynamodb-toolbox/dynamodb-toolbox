export type NoneMetricsOption = 'NONE'
export type SizeMetricsOption = 'SIZE'
export type MetricsOption = NoneMetricsOption | SizeMetricsOption

export interface MetricsOptions {
  /** Determines whether item collection metrics are returned. */
  metrics?: MetricsOption
}

export const metricsOptionsSet = new Set<MetricsOption>(['NONE', 'SIZE'])
