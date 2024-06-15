import type { Attribute, AttributeBasicValue } from 'v1/schema/attributes'

import type { ExtensionParser } from './types/extensionParser'
import type { ParsingMode } from './types/options'

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
