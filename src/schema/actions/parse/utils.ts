import type { Attribute, AttributeBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import type { ExtensionParser, WriteMode } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

import type { ParseValueOptions } from './options.js'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})

export const isRequired = (attribute: Attribute, mode: WriteMode): boolean => {
  switch (mode) {
    case 'put':
      return attribute.required !== 'never'
    case 'key':
    case 'update':
      return attribute.required === 'always'
  }
}

export const applyCustomValidation = (
  attribute: Attribute,
  inputValue: unknown,
  options: ParseValueOptions = {}
): void => {
  const { mode = 'put' } = options

  const customValidator = attribute.validators[attribute.key ? 'key' : mode]
  if (customValidator !== undefined) {
    const validationResult = customValidator(inputValue, attribute)

    if (validationResult !== true) {
      const { path } = attribute

      throw new DynamoDBToolboxError('parsing.customValidationFailed', {
        message: `Custom validation${
          path !== undefined ? ` for attribute '${path}'` : ''
        } failed${isString(validationResult) ? ` with message: ${validationResult}` : ''}.`,
        path,
        payload: {
          received: inputValue,
          validationResult
        }
      })
    }
  }
}
