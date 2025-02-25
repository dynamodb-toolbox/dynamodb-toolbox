import type { Attribute, AttributeBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { ExtensionParser, WriteMode } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

import type { ParseAttrValueOptions } from './options.js'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})

export const isRequired = (attribute: Attribute, mode: WriteMode): boolean => {
  switch (mode) {
    case 'put':
      return attribute.state?.required !== 'never'
    case 'key':
    case 'update':
      return attribute.state?.required === 'always'
  }
}

const getValidator = (attribute: Attribute, mode: WriteMode) => {
  if (attribute.state.key) {
    return attribute.state.keyValidator
  }

  switch (mode) {
    case 'key':
      return attribute.state.keyValidator
    case 'put':
      return attribute.state.putValidator
    case 'update':
      return attribute.state.updateValidator
  }
}

export const applyCustomValidation = (
  attribute: Attribute,
  inputValue: unknown,
  options: ParseAttrValueOptions = {}
): void => {
  const { mode = 'put', valuePath = [] } = options

  const customValidator = getValidator(attribute, mode)
  if (customValidator !== undefined) {
    const validationResult = customValidator(inputValue, attribute)

    if (validationResult !== true) {
      const path = formatValuePath(valuePath)

      throw new DynamoDBToolboxError('parsing.customValidationFailed', {
        message: `Custom validation${
          path !== undefined ? ` for attribute '${path}'` : ''
        } failed${isString(validationResult) ? ` with message: ${validationResult}` : ''}.`,
        path,
        payload: { received: inputValue, validationResult }
      })
    }
  }
}
