import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

export type NoneMetricsOption = 'NONE'
export type SizeMetricsOption = 'SIZE'
export type MetricsOption = NoneMetricsOption | SizeMetricsOption

export const metricsOptions = ['NONE', 'SIZE'] as const satisfies readonly MetricsOption[]
export const metricsOptionsSet = new Set<MetricsOption>(metricsOptions)

export const parseMetricsOption = (metrics: MetricsOption): MetricsOption => {
  if (!metricsOptionsSet.has(metrics)) {
    throw new DynamoDBToolboxError('options.invalidMetricsOption', {
      message: `Invalid metrics option: '${String(metrics)}'. 'metrics' must be one of: ${[
        ...metricsOptionsSet
      ].join(', ')}.`,
      payload: { metrics }
    })
  }

  return metrics
}
