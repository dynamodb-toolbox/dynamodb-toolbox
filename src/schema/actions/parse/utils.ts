import type { Attribute, AttributeBasicValue } from '~/schema/attributes/index.js'

import type { ExtensionParser } from './types/extensionParser.js'
import type { ParsingMode } from './types/options.js'

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
