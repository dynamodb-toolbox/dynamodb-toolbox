import { DynamoDBToolboxError } from 'v1/errors/dynamoDBToolboxError'
import { CapacityOption, capacityOptionsSet } from 'v1/commands/constants/options/capacity'

export const parseCapacityOption = (capacity: CapacityOption): CapacityOption => {
  if (!capacityOptionsSet.has(capacity)) {
    throw new DynamoDBToolboxError('invalidCommandCapacityOption', {
      message: `Invalid capacity option: '${String(capacity)}'. 'capacity' must be one of: ${[
        ...capacityOptionsSet
      ].join(', ')}.`,
      payload: { capacity }
    })
  } else {
    return capacity
  }
}
