import type { ExtensionParser } from 'v1/validation/parseClonedInput/types'
import type { ReferenceExtension } from 'v1/commands/types'
import { $GET } from 'v1/commands/updateItem/constants'
import { isArray } from 'v1/utils/validation/isArray'
import { DynamoDBToolboxError } from 'v1/errors'
import { parseAttributeClonedInput } from 'v1/validation/parseClonedInput/attribute'

import { hasGetOperation } from '../utils'

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

  return {
    isExtension: true,
    parsedExtension: {
      [$GET]: [
        // NOTE: Validation will be done in UpdateExpressionParser
        reference,
        ...(fallback !== undefined ? [parseAttributeClonedInput(attribute, fallback, options)] : [])
      ]
    }
  }
}
