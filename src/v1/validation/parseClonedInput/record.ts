import type { RecordAttribute, AttributeBasicValue, Extension, Transformer } from 'v1/schema'
import {
  $type,
  $keys,
  $elements,
  $transform
} from 'v1/schema/attributes/constants/attributeOptions'
import { isPrimitiveAttribute } from 'v1/schema/utils/isPrimitiveAttribute'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { RecordAttributeParsedBasicValue } from '../types'
import type { ParsingOptions } from './types'
import { parseAttributeClonedInput } from './attribute'
import { parsePrimitiveAttributeClonedInput } from './primitive'

export const parseRecordAttributeClonedInput = <EXTENSION extends Extension>(
  recordAttribute: RecordAttribute,
  input: AttributeBasicValue<EXTENSION>,
  parsingOptions: ParsingOptions<EXTENSION> = {} as ParsingOptions<EXTENSION>
): RecordAttributeParsedBasicValue<EXTENSION> => {
  if (!isObject(input)) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${recordAttribute.path} should be a ${recordAttribute.type}`,
      path: recordAttribute.path,
      payload: {
        received: input,
        expected: recordAttribute.type
      }
    })
  }

  const parsedInput: RecordAttributeParsedBasicValue<EXTENSION> = { [$type]: 'record' }

  Object.entries(input).forEach(([key, element]) => {
    const parsedElementInput = parseAttributeClonedInput(
      recordAttribute.elements,
      element,
      parsingOptions
    )

    if (parsedElementInput !== undefined) {
      parsedInput[
        parsePrimitiveAttributeClonedInput(recordAttribute.keys, key) as string
      ] = parsedElementInput
    }
  })

  if (recordAttribute.keys.transform !== undefined) {
    parsedInput[$transform] = {
      [$keys]: recordAttribute.keys.transform as Transformer<string, string>
    }
  }

  if (
    isPrimitiveAttribute(recordAttribute.elements) &&
    recordAttribute.elements.transform !== undefined
  ) {
    if (parsedInput[$transform] === undefined) {
      parsedInput[$transform] = { [$elements]: recordAttribute.elements.transform as Transformer }
    } else {
      parsedInput[$transform][$elements] = recordAttribute.elements.transform as Transformer
    }
  }

  return parsedInput
}
