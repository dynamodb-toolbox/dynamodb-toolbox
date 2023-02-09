export type NoneMetricsOption = 'NONE'
export type SizeMetricsOption = 'SIZE'
export type MetricsOption = NoneMetricsOption | SizeMetricsOption

export const metricsOptionsSet = new Set<MetricsOption>(['NONE', 'SIZE'])
