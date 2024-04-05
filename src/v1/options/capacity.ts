import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'

export type NoneCapacityOption = 'NONE'
export type TotalCapacityOption = 'TOTAL'
export type IndexesCapacityOption = 'INDEXES'

export type CapacityOption = NoneCapacityOption | TotalCapacityOption | IndexesCapacityOption

export const capacityOptionsSet = new Set<CapacityOption>(['NONE', 'TOTAL', 'INDEXES'])

export const parseCapacityOption = (capacity: CapacityOption): CapacityOption => {
  if (!capacityOptionsSet.has(capacity)) {
    throw new DynamoDBToolboxError('operations.invalidCapacityOption', {
      message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
        ...capacityOptionsSet
      ].join(', ')}.`,
      payload: { capacity }
    })
  }

  return capacity
}
