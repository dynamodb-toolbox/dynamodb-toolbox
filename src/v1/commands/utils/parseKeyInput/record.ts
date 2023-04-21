import type { RecordAttribute, PossiblyUndefinedResolvedAttribute } from 'v1/item'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributeKeyInput } from './attribute'

export const parseRecordAttributeKeyInput = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(input)) {
    throw new DynamoDBToolboxError('commands.parseKeyInput.invalidAttributeInput', {
      message: `Attribute ${recordAttribute.path} should be an ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: input,
        expected: recordAttribute.type
      }
    })
  }

  const parsedKeyInput: PossiblyUndefinedResolvedAttribute = {}

  Object.entries(input).forEach(([key, element]) => {
    const parsedElementKeyInput = parseAttributeKeyInput(recordAttribute.elements, element)

    if (parsedElementKeyInput !== undefined) {
      parsedKeyInput[
        parseAttributeKeyInput(recordAttribute.keys, key) as string
      ] = parsedElementKeyInput
    }
  })

  return parsedKeyInput
}
