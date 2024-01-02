import type { AttributeBasicValue, AttributeValue, RecordAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/validation/parseClonedInput/types'
import { parsePrimitiveAttributeClonedInput } from 'v1/validation/parseClonedInput/primitive'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput'
import { isObject } from 'v1/utils/validation/isObject'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $SET, $REMOVE } from 'v1/operations/updateItem/constants'
import { hasSetOperation } from 'v1/operations/updateItem/utils'

function* parseRecordElementClonedInput(
  attribute: RecordAttribute,
  inputValue: AttributeValue<UpdateItemInputExtension>,
  options: ParsingOptions<UpdateItemInputExtension>
): Generator<AttributeValue<UpdateItemInputExtension>, AttributeValue<UpdateItemInputExtension>> {
  // $REMOVE is allowed (we need this as elements 'required' prop is defaulted to "atLeastOnce")
  if (inputValue === $REMOVE) {
    yield $REMOVE
    return $REMOVE
  }

  return yield* parseAttributeClonedInput(attribute.elements, inputValue, options)
}

export const parseRecordExtension = (
  attribute: RecordAttribute,
  input: AttributeValue<UpdateItemInputExtension> | undefined,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  if (hasSetOperation(input)) {
    const parser = parseAttributeClonedInput(attribute, input[$SET], {
      ...options,
      // Should a simple record of valid elements (not extended)
      parseExtension: undefined
    })

    return {
      isExtension: true,
      *extensionParser() {
        yield { [$SET]: parser.next().value }
        return { [$SET]: parser.next().value }
      }
    }
  }

  if (isObject(input)) {
    const parsers: [
      Generator<AttributeValue<UpdateItemInputExtension>, AttributeValue<UpdateItemInputExtension>>,
      Generator<AttributeValue<UpdateItemInputExtension>, AttributeValue<UpdateItemInputExtension>>
    ][] = Object.entries(input)
      .filter(([, inputValue]) => inputValue !== undefined)
      .map(([inputKey, inputValue]) => [
        parsePrimitiveAttributeClonedInput<never>(attribute.keys, inputKey, {
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

    return {
      isExtension: true,
      *extensionParser() {
        yield Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )

        return Object.fromEntries(
          parsers
            .map(([keyParser, elementParser]) => [
              keyParser.next().value,
              elementParser.next().value
            ])
            .filter(([, element]) => element !== undefined)
        )
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
