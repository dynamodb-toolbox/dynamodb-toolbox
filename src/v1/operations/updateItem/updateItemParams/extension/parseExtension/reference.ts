import type { Attribute, AttributeValue } from 'v1/schema'
import type { ReferenceExtension } from 'v1/operations/types'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { isArray } from 'v1/utils/validation/isArray'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { DynamoDBToolboxError } from 'v1/errors'

import type { UpdateItemInputExtension } from 'v1/operations/updateItem/types'
import { $GET } from 'v1/operations/updateItem/constants'
import { hasGetOperation } from 'v1/operations/updateItem/utils'
import cloneDeep from 'lodash.clonedeep'
import { isString } from 'v1/utils/validation'

export const parseReferenceExtension: ExtensionParser<
  ReferenceExtension,
  UpdateItemInputExtension
> = (attribute, inputValue, options) => {
  if (hasGetOperation(inputValue)) {
    return {
      isExtension: true,
      *extensionParser() {
        const isInputValueArray = isArray(inputValue[$GET])
        let reference: string | undefined = undefined
        let fallbackParser:
          | Generator<AttributeValue<ReferenceExtension>, AttributeValue<ReferenceExtension>>
          | undefined = undefined

        if (isInputValueArray) {
          const [_reference, fallback, ...rest] = inputValue[$GET]
          reference = _reference

          if (fallback !== undefined) {
            fallbackParser = parseAttributeClonedInput(attribute, fallback, options)
          }

          const clonedValue = {
            [$GET]: [
              cloneDeep(reference),
              ...[
                fallbackParser !== undefined
                  ? [fallbackParser.next().value]
                  : rest.length === 0
                  ? []
                  : [undefined]
              ],
              ...cloneDeep(rest)
            ]
          }
          yield clonedValue
        } else {
          const clonedValue = { [$GET]: cloneDeep(inputValue[$GET]) }
          yield clonedValue
        }

        if (!isInputValueArray) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `Reference for attribute ${attribute.path} should be a tuple of one or two elements`,
            path: attribute.path,
            payload: {
              received: inputValue[$GET]
            }
          })
        }

        if (!isString(reference)) {
          throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
            message: `First element of a reference for attribute ${attribute.path} should be a string`,
            path: attribute.path,
            payload: {
              received: inputValue[$GET][0]
            }
          })
        }

        const parsedValue = {
          [$GET]: [
            // NOTE: Reference validation will be done in UpdateExpressionParser
            reference,
            ...(fallbackParser !== undefined ? [fallbackParser.next().value] : [])
          ]
        }
        yield parsedValue

        const collapsedValue = {
          [$GET]: [
            // NOTE: Reference validation will be done in UpdateExpressionParser
            reference,
            ...(fallbackParser !== undefined ? [fallbackParser.next().value] : [])
          ]
        }
        return collapsedValue
      }
    }
  }

  return {
    isExtension: false,
    basicInput: inputValue
  }
}
