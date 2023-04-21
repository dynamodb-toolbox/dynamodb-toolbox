import type { RecordAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'
import { DynamoDBToolboxError } from 'v1/errors'

import { parseAttributePutCommandInput } from './attribute'

export const parseRecordAttributePutCommandInput = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(input)) {
    throw new DynamoDBToolboxError('commands.putItem.invalidAttributeInput', {
      message: `Attribute ${recordAttribute.path} should be an ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: input,
        expected: recordAttribute.type
      }
    })
  }

  const parsedPutItemInput: PossiblyUndefinedResolvedAttribute = {}

  Object.entries(input).forEach(([key, element]) => {
    const parsedAttributePutCommandInput = parseAttributePutCommandInput(
      recordAttribute.elements,
      element
    )

    if (parsedAttributePutCommandInput !== undefined) {
      parsedPutItemInput[
        parseAttributePutCommandInput(recordAttribute.keys, key) as string
      ] = parsedAttributePutCommandInput
    }
  })

  return parsedPutItemInput
}
