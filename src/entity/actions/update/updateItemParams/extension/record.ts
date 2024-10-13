import type { Attribute, AttributeBasicValue, RecordAttribute } from '~/attributes/index.js'
import { Parser } from '~/schema/actions/parse/index.js'
import type { ExtensionParser, ExtensionParserOptions } from '~/schema/index.js'
import type { TransformedValue, ValidValue } from '~/schema/index.js'
import { isObject } from '~/utils/validation/isObject.js'

import { $SET, isRemoval, isSetting } from '../../symbols/index.js'
import type { UpdateItemInputExtension } from '../../types.js'
import { parseUpdateExtension } from './attribute.js'

function* recordElementsParser(
  attribute: RecordAttribute,
  inputValue: unknown,
  { transform = true }: ExtensionParserOptions = {}
): Generator<
  ValidValue<Attribute, { extension: UpdateItemInputExtension }>,
  | ValidValue<Attribute, { extension: UpdateItemInputExtension }>
  | TransformedValue<Attribute, { extension: UpdateItemInputExtension }>
> {
  if (isRemoval(inputValue)) {
    const parsedValue = inputValue
    if (transform) {
      yield parsedValue
    } else {
      return parsedValue
    }

    const transformedValue = parsedValue
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

  if (isSetting(input) && input[$SET] !== undefined) {
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              keyParser!.next().value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              elementParser!.next().value
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
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              keyParser!.next().value,
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              elementParser!.next().value
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
