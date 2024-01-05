import type { RequiredOption, Attribute, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'
import { isFunction } from 'v1/utils/validation'

import type { HasExtension } from '../types'
import type { ParsingOptions, ExtensionParser } from './types'
import { parseAnyAttributeClonedInput } from './any'
import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'
import { defaultParseExtension } from './utils'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

export function* parseAttributeClonedInput<
  INPUT_EXTENSION extends Extension = never,
  SCHEMA_EXTENSION extends Extension = INPUT_EXTENSION
>(
  attribute: Attribute,
  inputValue: AttributeValue<INPUT_EXTENSION> | undefined,
  ...[options = {} as ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]: If<
    HasExtension<INPUT_EXTENSION>,
    [options: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>],
    [options?: ParsingOptions<INPUT_EXTENSION, SCHEMA_EXTENSION>]
  >
): Generator<AttributeValue<INPUT_EXTENSION>, AttributeValue<INPUT_EXTENSION>> {
  const {
    operationName,
    schemaInput,
    requiringOptions = defaultRequiringOptions,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = (defaultParseExtension as unknown) as ExtensionParser<
      INPUT_EXTENSION,
      SCHEMA_EXTENSION
    >
  } = options

  let defaultedValue = inputValue

  if (defaultedValue === undefined) {
    const operationDefault = attribute.key
      ? attribute.defaults.key
      : operationName && attribute.defaults[operationName]

    defaultedValue = isFunction(operationDefault)
      ? (operationDefault(schemaInput) as AttributeValue<INPUT_EXTENSION> | undefined)
      : (operationDefault as AttributeValue<INPUT_EXTENSION> | undefined)
  }

  const { isExtension, extensionParser, basicInput } = parseExtension(
    attribute,
    defaultedValue,
    options
  )

  if (isExtension) {
    return yield* extensionParser()
  }

  if (basicInput === undefined) {
    const clonedValue = undefined
    yield clonedValue

    if (requiringOptions.has(attribute.required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    }

    const parsedValue = clonedValue
    yield parsedValue

    const collapsedValue = parsedValue
    return collapsedValue
  }

  switch (attribute.type) {
    case 'any':
      return yield* parseAnyAttributeClonedInput(basicInput)
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* parsePrimitiveAttributeClonedInput(attribute, basicInput, options)
    case 'set':
      return yield* parseSetAttributeClonedInput(attribute, basicInput, options)
    case 'list':
      return yield* parseListAttributeClonedInput(attribute, basicInput, options)
    case 'map':
      return yield* parseMapAttributeClonedInput(attribute, basicInput, options)
    case 'record':
      return yield* parseRecordAttributeClonedInput(attribute, basicInput, options)
    case 'anyOf':
      return yield* parseAnyOfAttributeClonedInput(attribute, basicInput, options)
  }
}
