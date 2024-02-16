import cloneDeep from 'lodash.clonedeep'

import type {
  Schema,
  RecordAttribute,
  RecordAttributeKeys,
  RecordAttributeElements,
  Extension,
  ExtendedValue
} from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation/isObject'

import type { ValidValue } from './parser'
import type { HasExtension, ParsingOptions } from './types'
import { attrWorkflow, ValidAttrValue } from './attribute'

export type ValidRecordAttrValue<
  ATTRIBUTE extends RecordAttribute,
  EXTENSION extends Extension = never
> =  // We cannot use Record type as it messes up map resolution down the line
  | {
      [KEY in Extract<ValidAttrValue<ATTRIBUTE['keys'], EXTENSION>, string>]?: ValidAttrValue<
        ATTRIBUTE['elements'],
        EXTENSION
      >
    }
  | ExtendedValue<EXTENSION, 'record'>

export function* recordAttributeParser<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: RecordAttribute,
  inputValue: unknown,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<
  ValidRecordAttrValue<RecordAttribute, INPUT_EXTENSION>,
  ValidRecordAttrValue<RecordAttribute, INPUT_EXTENSION>,
  ValidValue<Schema, SCHEMA_EXTENSION> | undefined
> {
  const { fill = true, transform = true } = options

  const parsers: [
    Generator<
      ValidValue<RecordAttributeKeys, INPUT_EXTENSION>,
      ValidValue<RecordAttributeKeys, INPUT_EXTENSION>,
      undefined
    >,
    Generator<
      ValidValue<RecordAttributeElements, INPUT_EXTENSION>,
      ValidValue<RecordAttributeElements, INPUT_EXTENSION>,
      ValidValue<Schema, SCHEMA_EXTENSION> | undefined
    >
  ][] = []

  const isInputValueObject = isObject(inputValue)
  if (isInputValueObject) {
    for (const [key, element] of Object.entries(inputValue)) {
      parsers.push([
        attrWorkflow(attribute.keys, key, options),
        attrWorkflow(attribute.elements, element, options)
      ])
    }
  }

  if (fill) {
    if (isInputValueObject) {
      const defaultedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
          .filter(([, element]) => element !== undefined)
      )
      const itemInput = yield defaultedValue

      const linkedValue = Object.fromEntries(
        parsers
          .map(([keyParser, elementParser]) => [
            keyParser.next().value,
            elementParser.next(itemInput).value
          ])
          .filter(([, element]) => element !== undefined)
      )
      yield linkedValue
    } else {
      const defaultedValue = cloneDeep(inputValue)
      yield defaultedValue

      const linkedValue = defaultedValue
      yield linkedValue
    }
  }

  if (!isInputValueObject) {
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

  const parsedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )

  if (transform) {
    yield parsedValue
  } else {
    return parsedValue
  }

  const transformedValue = Object.fromEntries(
    parsers
      .map(([keyParser, elementParser]) => [keyParser.next().value, elementParser.next().value])
      .filter(([, element]) => element !== undefined)
  )
  return transformedValue
}
