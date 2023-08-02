import { ExtensionParser } from './types'

export const defaultParseExtension: ExtensionParser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input
})
