import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'

export type NoneCapacityOption = 'NONE'
export type TotalCapacityOption = 'TOTAL'
export type IndexesCapacityOption = 'INDEXES'

export type CapacityOption = NoneCapacityOption | TotalCapacityOption | IndexesCapacityOption

export const capacityOptions = [
  'NONE',
  'TOTAL',
  'INDEXES'
] as const satisfies readonly CapacityOption[]
export const capacityOptionsSet = new Set<CapacityOption>(capacityOptions)

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
