import type { RecordAttribute, PossiblyUndefinedResolvedAttribute } from 'v1'
import { isObject } from 'v1/utils/validation'

import { parseAttributeKeyInput } from './attribute'

export const parseRecordAttributeKeyInput = (
  recordAttribute: RecordAttribute,
  input: PossiblyUndefinedResolvedAttribute
): PossiblyUndefinedResolvedAttribute => {
  if (!isObject(input)) {
    // TODO
    throw new Error()
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
