import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  SetAttribute,
  SetAttributeElements,
  Extension,
  ExtendedValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { isSet } from 'v1/utils/validation/isSet'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'
import { attrWorkflow, ValidAttrValue } from './attribute'

export type ValidSetAttrValue<
  ATTRIBUTE extends SetAttribute,
  EXTENSION extends Extension = never
> = Set<ValidAttrValue<ATTRIBUTE['elements']>> | ExtendedValue<EXTENSION, 'set'>

export function* setAttrWorkflow<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: SetAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidSetAttrValue<SetAttribute, INPUT_EXTENSION>,
  ValidSetAttrValue<SetAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const parsers: Generator<
    ValidValue<SetAttributeElements, INPUT_EXTENSION>,
    ValidValue<SetAttributeElements, INPUT_EXTENSION>,
    ValidValue<Schema, SCHEMA_EXTENSION> | undefined
  >[] = []

  const isInputValueSet = isSet(inputValue)
  if (isInputValueSet) {
    for (const element of inputValue.values()) {
      parsers.push(attrWorkflow(attribute.elements, element, options))
    }
  }

  if (fill) {
    if (isInputValueSet) {
      const defaultedValue = new Set(parsers.map(parser => parser.next().value))
      yield defaultedValue

      const linkedValue = new Set(parsers.map(parser => parser.next().value))
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueSet) {
    const { path, type } = attribute

    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Attribute ${path !== undefined ? `'${path}' ` : ''}should be a ${type}.`,
      path,
      payload: {
        received: inputValue,
        expected: type
      }
    })
  }

  const parsedValue = new Set(parsers.map(parser => parser.next().value))

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = new Set(parsers.map(parser => parser.next().value))
  return transformedValue
}
