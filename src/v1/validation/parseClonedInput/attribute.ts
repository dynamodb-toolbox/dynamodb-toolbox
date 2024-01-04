import type { RequiredOption, Attribute, Extension, AttributeValue } from 'v1/schema'
import type { If } from 'v1/types'
import { DynamoDBToolboxError } from 'v1/errors'

import type { HasExtension } from '../types'
import type { ParsingOptions, ExtensionParser } from './types'
import { parsePrimitiveAttributeClonedInput } from './primitive'
import { parseSetAttributeClonedInput } from './set'
import { parseListAttributeClonedInput } from './list'
import { parseMapAttributeClonedInput } from './map'
import { parseRecordAttributeClonedInput } from './record'
import { parseAnyOfAttributeClonedInput } from './anyOf'
import { defaultParseExtension } from './utils'

const defaultRequiringOptions = new Set<RequiredOption>(['atLeastOnce', 'always'])

// eslint-disable-next-line require-yield
export function* parseAttributeClonedInput<EXTENSION extends Extension = never>(
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  ...[parsingOptions = {} as ParsingOptions<EXTENSION>]: If<
    HasExtension<EXTENSION>,
    [options: ParsingOptions<EXTENSION>],
    [options?: ParsingOptions<EXTENSION>]
  >
): Generator<AttributeValue<EXTENSION>, AttributeValue<EXTENSION>> {
  const { requiringOptions = defaultRequiringOptions } = parsingOptions

  const {
    /**
     * @debt type "Maybe there's a way not to have to cast here"
     */
    parseExtension = (defaultParseExtension as unknown) as ExtensionParser<EXTENSION>
  } = parsingOptions

  const { isExtension, extensionParser, basicInput } = parseExtension(
    attribute,
    input,
    parsingOptions
  )

  if (isExtension) {
    return yield* extensionParser()
  }

  if (basicInput === undefined) {
    if (requiringOptions.has(attribute.required)) {
      throw new DynamoDBToolboxError('parsing.attributeRequired', {
        message: `Attribute ${attribute.path} is required`,
        path: attribute.path
      })
    } else {
      yield undefined
      return undefined
    }
  }

  switch (attribute.type) {
    case 'any':
      return input
    case 'boolean':
    case 'binary':
    case 'number':
    case 'string':
      return yield* parsePrimitiveAttributeClonedInput(attribute, basicInput, parsingOptions)
    case 'set':
      return yield* parseSetAttributeClonedInput(attribute, basicInput, parsingOptions)
    case 'list':
      return yield* parseListAttributeClonedInput(attribute, basicInput, parsingOptions)
    case 'map':
      return yield* parseMapAttributeClonedInput(attribute, basicInput, parsingOptions)
    case 'record':
      return yield* parseRecordAttributeClonedInput(attribute, basicInput, parsingOptions)
    case 'anyOf':
      return yield* parseAnyOfAttributeClonedInput(attribute, basicInput, parsingOptions)
  }
}
