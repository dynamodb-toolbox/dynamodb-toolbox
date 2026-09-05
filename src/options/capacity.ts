import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

/**
 * `capacity` option requesting no consumed-capacity metrics.
 */
export type NoneCapacityOption = 'NONE'
/**
 * `capacity` option requesting total consumed-capacity metrics.
 */
export type TotalCapacityOption = 'TOTAL'
/**
 * `capacity` option requesting per-index consumed-capacity metrics.
 */
export type IndexesCapacityOption = 'INDEXES'

/**
 * Accepted values for the `capacity` command option.
 */
export type CapacityOption = NoneCapacityOption | TotalCapacityOption | IndexesCapacityOption

export const capacityOptions = [
  'NONE',
  'TOTAL',
  'INDEXES'
] as const satisfies readonly CapacityOption[]
export const capacityOptionsSet = new Set<CapacityOption>(capacityOptions)

/**
 * Validate a `capacity` option value, throwing on an unknown value.
 */
export const parseCapacityOption = (capacity: CapacityOption): CapacityOption => {
  if (!capacityOptionsSet.has(capacity)) {
    throw new DynamoDBToolboxError('options.invalidCapacityOption', {
      message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
        ...capacityOptionsSet
      ].join(', ')}.`,
      payload: { capacity }
    })
  }

  return capacity
}
