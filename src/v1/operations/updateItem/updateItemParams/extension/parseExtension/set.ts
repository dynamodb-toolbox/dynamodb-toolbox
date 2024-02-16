import type { AttributeBasicValue, SetAttribute } from 'v1/schema'
import type { ExtensionParser, ParsingOptions } from 'v1/schema/actions/parse/types'
import { attrWorkflow } from 'v1/schema/actions/parse/attribute'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $ADD, $DELETE } from 'v1/operations/updateItem/constants'
import { hasAddOperation, hasDeleteOperation } from 'v1/operations/updateItem/utils'

export const parseSetExtension = (
  attribute: SetAttribute,
  input: unknown,
  options: ParsingOptions<UpdateItemInputExtension>
): ReturnType<ExtensionParser<UpdateItemInputExtension>> => {
  const { fill = true, transform = true } = options

  if (hasAddOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attrWorkflow(attribute, input[$ADD], {
          ...options,
          // Should a simple set of valid elements (not extended)
          parseExtension: undefined
        })

        if (fill) {
          const defaultedValue = { [$ADD]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$ADD]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$ADD]: parser.next().value }

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$ADD]: parser.next().value }
        return transformedValue
      }
    }
  }

  if (hasDeleteOperation(input)) {
    return {
      isExtension: true,
      *extensionParser() {
        const parser = attrWorkflow(attribute, input[$DELETE], {
          ...options,
          // Should a simple set of valid elements (not extended)
          parseExtension: undefined
        })

        if (fill) {
          const defaultedValue = { [$DELETE]: parser.next().value }
          yield defaultedValue

          const linkedValue = { [$DELETE]: parser.next().value }
          yield linkedValue
        }

        const parsedValue = { [$DELETE]: parser.next().value }

        if (transform) {
          yield parsedValue
        } else {
          return parsedValue
        }

        const transformedValue = { [$DELETE]: parser.next().value }
        return transformedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: input as AttributeBasicValue<UpdateItemInputExtension> | undefined
  }
}
