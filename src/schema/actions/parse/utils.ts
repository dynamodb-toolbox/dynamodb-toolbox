import type { AttrSchema, AttributeBasicValue } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { ExtensionParser, WriteMode } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

import type { ParseAttrValueOptions } from './options.js'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})

export const isRequired = (attribute: AttrSchema, mode: WriteMode): boolean => {
  switch (mode) {
    case 'put':
      return attribute.props?.required !== 'never'
    case 'key':
    case 'update':
      return attribute.props?.required === 'always'
  }
}

const getValidator = (attribute: AttrSchema, mode: WriteMode) => {
  if (attribute.props.key) {
    return attribute.props.keyValidator
  }

  switch (mode) {
    case 'key':
      return attribute.props.keyValidator
    case 'put':
      return attribute.props.putValidator
    case 'update':
      return attribute.props.updateValidator
  }
}

export const applyCustomValidation = (
  attribute: AttrSchema,
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
