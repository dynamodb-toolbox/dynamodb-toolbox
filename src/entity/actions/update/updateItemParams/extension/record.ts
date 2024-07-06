import { Parser } from '~/schema/actions/parse/index.js'
import type {
  ExtensionParser,
  ExtensionParserOptions,
  ParsedValue
} from '~/schema/actions/parse/index.js'
import type { Attribute, AttributeBasicValue, RecordAttribute } from '~/schema/attributes/index.js'
import type { Schema } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { $REMOVE, $SET } from '../../constants.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { isSetUpdate } from '../../utils.js'
import { parseUpdateExtension } from './attribute.js'

function* recordElementsParser(
  attribute: RecordAttribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
): Generator<
  ParsedValue<Attribute, { extension: UpdateItemInputExtension }>,
  ParsedValue<Attribute, { extension: UpdateItemInputExtension }>,
  ParsedValue<Schema, { extension: UpdateItemInputExtension }> | undefined
> {
  if (inputValue === $REMOVE) {
    const parsedValue: typeof $REMOVE = $REMOVE
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue: typeof $REMOVE = $REMOVE
    return transformedValue
  }

  return yield* new Parser(attribute.elements).start(inputValue, {
    mode: 'update',
    fill: false,
    transform,
    parseExtension: parseUpdateExtension
  })
}

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: unknown,
  options: ExtensionParserOptions = {}
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { transform = true } = options

  if (isSetUpdate(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = new Parser(attribute).start(input[$SET], { fill: false, transform })

        const parsedValue = { [$SET]: parser.next().value }
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  if (isObject(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers = Object.entries(input)
          .filter(([, inputValue]) => inputValue !== undefined)
          .map(([inputKey, inputValue]) => [
            new Parser(attribute.keys).start(inputKey, { fill: false, transform }),
            recordElementsParser(attribute, inputValue, options)
          ])

        const parsedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
