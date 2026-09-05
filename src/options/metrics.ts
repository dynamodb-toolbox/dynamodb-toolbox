import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

/**
 * `metrics` option requesting no item-collection metrics.
 */
export type NoneMetricsOption = 'NONE'
/**
 * `metrics` option requesting item-collection size metrics.
 */
export type SizeMetricsOption = 'SIZE'
/**
 * Accepted values for the `metrics` command option.
 */
export type MetricsOption = NoneMetricsOption | SizeMetricsOption

export const metricsOptions = ['NONE', 'SIZE'] as const satisfies readonly MetricsOption[]
export const metricsOptionsSet = new Set<MetricsOption>(metricsOptions)

/**
 * Validate a `metrics` option value, throwing on an unknown value.
 */
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
