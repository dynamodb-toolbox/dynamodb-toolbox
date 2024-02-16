import type { AttributeBasicValue } from 'v1/schema/attributes'

import type { ExtensionParser } from './types'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input as AttributeBasicValue<never> | undefined
})
