import type { Attribute, AttributeBasicValue } from 'v1/schema/attributes'

import type { ExtensionParser, Operation } from './types'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})

export const isRequired = (attribute: Attribute, operation: Operation): boolean => {
  switch (operation) {
    case 'put':
      return attribute.required !== 'never'
    case 'key':
    case 'update':
      return attribute.required === 'always'
  }
}
