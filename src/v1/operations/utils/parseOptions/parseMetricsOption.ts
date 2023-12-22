import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { metricsOptionsSet, MetricsOption } from 'v1/operations/constants/options/metrics'

export const parseMetricsOption = (metrics: MetricsOption): MetricsOption => {
  if (!metricsOptionsSet.has(metrics)) {
    throw new DynamoDBToolboxError('operations.invalidMetricsOption', {
      message: `Invalid metrics option: '${String(metrics)}'. 'metrics' must be one of: ${[
        ...metricsOptionsSet
      ].join(', ')}.`,
      payload: { metrics }
    })
  }

  return metrics
}
