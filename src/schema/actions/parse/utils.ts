import { DynamoDBToolboxError } from '~/errors/index.js'
import { formatValuePath } from '~/schema/actions/utils/formatValuePath.js'
import type { ExtensionParser, Schema, SchemaBasicValue, WriteMode } from '~/schema/index.js'
import { isString } from '~/utils/validation/isString.js'

import type { ParseAttrValueOptions } from './options.js'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as SchemaBasicValue<never> | undefined
})

export const isRequired = (schema: Schema, mode: WriteMode): boolean => {
  switch (mode) {
    case 'put':
      return schema.props?.required !== 'never'
    case 'key':
    case 'update':
      return schema.props?.required === 'always'
  }
}

const getValidator = (schema: Schema, mode: WriteMode) => {
  if (schema.props.key) {
    return schema.props.keyValidator
  }

  switch (mode) {
    case 'key':
      return schema.props.keyValidator
    case 'put':
      return schema.props.putValidator
    case 'update':
      return schema.props.updateValidator
  }
}

export const applyCustomValidation = (
  schema: Schema,
  inputValue: unknown,
  options: ParseAttrValueOptions = {}
): void => {
  const { mode = 'put', valuePath = [] } = options

  const customValidator = getValidator(schema, mode)
  if (customValidator !== undefined) {
    const validationResult = customValidator(inputValue, schema)

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
