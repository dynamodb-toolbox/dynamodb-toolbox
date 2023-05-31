import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { CapacityOption, capacityOptionsSet } from 'v1/commands/constants/options/capacity'

export const parseCapacityOption = (capacity: CapacityOption): CapacityOption => {
  if (!capacityOptionsSet.has(capacity)) {
    throw new DynamoDBToolboxError('commands.invalidCapacityOption', {
      message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
        ...capacityOptionsSet
      ].join(', ')}.`,
      payload: { capacity }
    })
  }

  return capacity
}