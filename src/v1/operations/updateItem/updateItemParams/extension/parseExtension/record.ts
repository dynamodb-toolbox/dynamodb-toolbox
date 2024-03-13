import type {
  Schema,
  Attribute,
  RecordAttribute,
  ParsedValue,
  AttributeBasicValue
} from 'v1/schema'
import type { ExtensionParser, ExtensionParserOptions } from 'v1/schema/actions/parse/types'
import { attrWorkflow } from 'v1/schema/actions/parse'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

import { parseUpdateExtension } from './attribute'

function* recordElementsWorkflow(
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

  return yield* attrWorkflow(attribute.elements, inputValue, {
    operation: 'update',
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

  if (hasSetOperation(input) && input[$SET] !== undefined) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attrWorkflow(attribute, input[$SET], { fill: false, transform })

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
            attrWorkflow(attribute.keys, inputKey, { fill: false, transform }),
            recordElementsWorkflow(attribute, inputValue, options)
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
