import { ExtensionCollapser } from './types'

export const defaultCollapseExtension: ExtensionCollapser<never> = (_, input) => ({
  isExtension: false,
  basicInput: input
})
