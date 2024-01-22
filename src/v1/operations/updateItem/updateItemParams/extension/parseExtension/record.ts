import type { AttributeBasicValue, AttributeValue, RecordAttribute, Item } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
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
  const { clone = true } = options

  if (inputValue === $REMOVE) {
    if (clone) {
      const clonedValue: typeof $REMOVE = $REMOVE
      yield clonedValue

      const linkedValue: typeof $REMOVE = $REMOVE
      yield linkedValue
    }

    const parsedValue: typeof $REMOVE = $REMOVE
    yield parsedValue

    const collapsedValue: typeof $REMOVE = $REMOVE
    return collapsedValue
  }

  return yield* parseAttributeClonedInput(attribute.elements, inputValue, options)
}

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { clone = true } = options

  if (hasSetOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = parseAttributeClonedInput(attribute, input[$SET], {
          ...options,
          // Should a simple record of valid elements (not extended)
          parseExtension: undefined
        })

        if (clone) {
          const clonedValue = { [$SET]: parser.next().value }
          yield clonedValue

          const linkedValue = { [$SET]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$SET]: parser.next().value }
        yield parsedValue

        const collapsedValue = { [$SET]: parser.next().value }
        return collapsedValue
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
            parseAttributeClonedInput<never, UpdateItemInputExtension>(attribute.keys, inputKey, {
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

        if (clone) {
          const clonedValue = Object.fromEntries(
            parsers
              .map(([keyParser, elementParser]) => [
                keyParser.next().value,
                elementParser.next().value
              ])
              .filter(([, element]) => element !== undefined)
          )
          yield clonedValue

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

        const collapsedValue = Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
