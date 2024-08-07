import type {
  AnyAttribute,
  Attribute,
  AttributeBasicValue,
  ListAttribute,
  PrimitiveAttribute,
  SetAttribute
} from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { isString } from '~/utils/validation/isString.js'

import type { ExtensionParser } from './types/extensionParser.js'
import type { ParsingMode, ParsingOptions } from './types/options.js'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})

export const isRequired = (attribute: Attribute, mode: ParsingMode): boolean => {
  switch (mode) {
    case 'put':
      return attribute.required !== 'never'
    case 'key':
    case 'update':
      return attribute.required === 'always'
  }
}

export const runCustomValidation = (
  attribute: AnyAttribute | PrimitiveAttribute | SetAttribute | ListAttribute,
  inputValue: unknown,
  options: ParsingOptions = {}
): void => {
  const { mode = 'put' } = options

  const customValidator = attribute.validators[mode]
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
