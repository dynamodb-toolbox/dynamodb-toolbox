import { DynamoDBToolboxError } from '~/errors/dynamoDBToolboxError.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

export const parseShowEntityAttrOption = (showEntityAttr: boolean): boolean => {
  if (!isBoolean(showEntityAttr)) {
    throw new DynamoDBToolboxError('options.invalidShowEntityAttrOption', {
      message: `Invalid 'showEntityAttr' option: '${String(
        showEntityAttr
      )}'. 'showEntityAttr' must be a boolean.`,
      payload: { showEntityAttr }
    })
  }

  return showEntityAttr
}
