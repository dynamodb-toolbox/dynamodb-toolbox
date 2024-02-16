import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  ListAttribute,
  ListAttributeElements,
  Extension,
  ExtendedValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'
import { attrWorkflow, ValidAttrValue } from './attribute'

export type ValidListAttrValue<
  ATTRIBUTE extends ListAttribute,
  EXTENSION extends Extension = never
> = ValidAttrValue<ATTRIBUTE['elements']>[] | ExtendedValue<EXTENSION, 'list'>

export function* listAttrWorkflow<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: ListAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidListAttrValue<ListAttribute, INPUT_EXTENSION>,
  ValidListAttrValue<ListAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const parsers: Generator<
    ValidValue<ListAttributeElements, INPUT_EXTENSION>,
    ValidValue<ListAttributeElements, INPUT_EXTENSION>,
    ValidValue<Schema, SCHEMA_EXTENSION> | undefined
  >[] = []

  const isInputValueArray = isArray(inputValue)
  if (isInputValueArray) {
    for (const element of inputValue) {
      parsers.push(attrWorkflow(attribute.elements, element, options))
    }
  }

  if (fill) {
    if (isInputValueArray) {
      const defaultedValue = parsers.map(parser => parser.next().value)
      const itemInput = yield defaultedValue

      const linkedValue = parsers.map(parser => parser.next(itemInput).value)
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueArray) {
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

  const parsedValue = parsers.map(parser => parser.next().value)

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = parsers.map(parser => parser.next().value)
  return transformedValue
}
