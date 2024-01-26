import type { AttributeBasicValue, AttributeValue, RecordAttribute, Item } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/parsing/types'
import { attributeParser } from 'v1/parsing'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

function* parseRecordElementClonedInput(
  attribute: RecordAttribute,
  inputValue: AttributeValue<UpdateItemInputExtension>,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<
  AttributeValue<UpdateItemInputExtension>,
  AttributeValue<UpdateItemInputExtension>,
  Item<UpdateItemInputExtension> | undefined
> {
  const { fill = true } = options

  if (inputValue === $REMOVE) {
    if (fill) {
      const defaultedValue: typeof $REMOVE = $REMOVE
      yield defaultedValue

      const linkedValue: typeof $REMOVE = $REMOVE
      yield linkedValue
    }

    const parsedValue: typeof $REMOVE = $REMOVE
    yield parsedValue

    const transformedValue: typeof $REMOVE = $REMOVE
    return transformedValue
  }

  return yield* attributeParser(attribute.elements, inputValue, options)
}

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true } = options

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attributeParser(attribute, input[$SET], {
          ...options,
          // Should a simple record of valid elements (not extended)
          parseExtension: undefined
        })

        if (fill) {
          const defaultedValue = { [$SET]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$SET]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$SET]: parser.next().value }
        yield parsedValue

        const transformedValue = { [$SET]: parser.next().value }
        return transformedValue
      }
    }
  }

  if (isObject(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parsers: [
          Generator<
            AttributeValue<UpdateItemInputExtension>,
            AttributeValue<UpdateItemInputExtension>
          >,
          Generator<
            AttributeValue<UpdateItemInputExtension>,
            AttributeValue<UpdateItemInputExtension>
          >
        ][] = Object.entries(input)
          .filter(([, inputValue]) => inputValue !== undefined)
          .map(([inputKey, inputValue]) => [
            attributeParser<never, UpdateItemInputExtension>(attribute.keys, inputKey, {
              ...options,
              // Should a simple string (not extended)
              parseExtension: undefined
            }),
            parseRecordElementClonedInput(
              attribute,
              /**
               * @debt type "TODO: Fix this cast"
               */
              inputValue as AttributeValue<UpdateItemInputExtension>,
              options
            )
          ])

        if (fill) {
          const defaultedValue = Object.fromEntries(
            parsers
              .map(([keyParser, elementParser]) => [
                keyParser.next().value,
                elementParser.next().value
              ])
              .filter(([, element]) => element !== undefined)
          )
          yield defaultedValue

          const linkedValue = Object.fromEntries(
            parsers
              .map(([keyParser, elementParser]) => [
                keyParser.next().value,
                elementParser.next().value
              ])
              .filter(([, element]) => element !== undefined)
          )
          yield linkedValue
        }

        const parsedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        yield parsedValue

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
