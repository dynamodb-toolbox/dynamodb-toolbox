import cloneDeep from 'lodash.clonedeep'

import type { RequiredOption, Attribute, Extension, AttributeValue, Item } from 'v1/schema'
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
): Generator<
  AttributeValue<INPUT_EXTENSION>,
  AttributeValue<INPUT_EXTENSION>,
  Item<SCHEMA_EXTENSION> | undefined
> {
  const {
    operationName,
    requiringOptions = defaultRequiringOptions,
    clone = true,
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = (defaultParseExtension as unknown) as ExtensionParser<
      INPUT_EXTENSION,
      SCHEMA_EXTENSION
    >
  } = options

  let filledValue: AttributeValue<INPUT_EXTENSION> | undefined = inputValue
  let shouldStillClone = clone

  if (shouldStillClone === true && filledValue === undefined) {
    let clonedValue: AttributeValue<INPUT_EXTENSION> | undefined = undefined

    if (operationName !== undefined) {
      const operationDefault = attribute.defaults[attribute.key ? 'key' : operationName]
      clonedValue = isFunction(operationDefault) ? operationDefault() : cloneDeep(operationDefault)
    }

    const itemInput = yield clonedValue

    let linkedValue: AttributeValue<INPUT_EXTENSION> | undefined = clonedValue
    if (operationName !== undefined && linkedValue === undefined && itemInput !== undefined) {
      const operationLink = attribute.links[attribute.key ? 'key' : operationName]
      linkedValue = isFunction(operationLink) ? operationLink(itemInput) : linkedValue
    }
    yield linkedValue

    filledValue = linkedValue
    shouldStillClone = false
  }

  const nextOpts = { ...options, clone: shouldStillClone }

  const { isExtension, extensionParser, basicInput } = parseExtension(
    attribute,
    filledValue,
    nextOpts
  )

  if (isExtension) {
    return yield* extensionParser()
  }

  if (basicInput === undefined) {
    // We don't need to clone
    if (requiringOptions.has(attribute.required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    }

    const parsedValue = basicInput
    yield parsedValue

    const collapsedValue = parsedValue
    return collapsedValue
  }

  switch (attribute.type) {
    case 'any':
      return yield* parseAnyAttributeClonedInput(basicInput, nextOpts)
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* parsePrimitiveAttributeClonedInput(attribute, basicInput, nextOpts)
    case 'set':
      return yield* parseSetAttributeClonedInput(attribute, basicInput, nextOpts)
    case 'list':
      return yield* parseListAttributeClonedInput(attribute, basicInput, nextOpts)
    case 'map':
      return yield* parseMapAttributeClonedInput(attribute, basicInput, nextOpts)
    case 'record':
      return yield* parseRecordAttributeClonedInput(attribute, basicInput, nextOpts)
    case 'anyOf':
      return yield* parseAnyOfAttributeClonedInput(attribute, basicInput, nextOpts)
  }
}
