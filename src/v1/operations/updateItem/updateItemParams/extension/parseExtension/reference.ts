import type { ReferenceExtension } from 'v1/operations/types'
import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import { isArray } from 'v1/utils/validation/isArray'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'
import { DynamoDBToolboxError } from 'v1/errors'

import { $GET } from 'v1/operations/updateItem/constants'
import { hasGetOperation } from 'v1/operations/updateItem/utils'

export const parseReferenceExtension: ExtensionParser<ReferenceExtension> = (
  attribute,
  input,
  options
) => {
  if (!hasGetOperation(input)) {
    return {
      isExtension: false,
      basicInput: input
    }
  }

  if (!isArray(input[$GET])) {
    throw new DynamoDBToolboxError('parsing.invalidAttributeInput', {
      message: `Reference for attribute ${attribute.path} should be a tuple of one or two elements`,
      path: attribute.path,
      payload: {
        received: input[$GET]
      }
    })
  }

  const [reference, fallback] = input[$GET]

  const parser = parseAttributeClonedInput(attribute, fallback, options)

  return {
    isExtension: true,
    *extensionParser() {
      yield {
        [$GET]: [
          // NOTE: Reference validation will be done in UpdateExpressionParser
          reference,
          ...(fallback !== undefined ? [parser.next().value] : [])
        ]
      }
      return {
        [$GET]: [
          // NOTE: Reference validation will be done in UpdateExpressionParser
          reference,
          ...(fallback !== undefined ? [parser.next().value] : [])
        ]
      }
    }
  }
}
