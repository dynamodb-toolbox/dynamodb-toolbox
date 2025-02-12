import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

export const parseEntityAttrFilterOption = (entityAttrFilter: boolean): boolean => {
  if (!isBoolean(entityAttrFilter)) {
    throw new DynamoDBToolboxError('options.invalidEntityAttrFilterOption', {
      message: `Invalid 'entityAttrFilter' option: '${String(
        entityAttrFilter
      )}'. 'entityAttrFilter' must be a boolean.`,
      payload: { entityAttrFilter }
    })
  }

  return entityAttrFilter
}
