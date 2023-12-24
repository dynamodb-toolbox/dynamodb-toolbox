import { ExtensionCollapser } from './types'

export const defaultCollapseExtension: ExtensionCollapser<never> = input => ({
  isExtension: false,
  basicInput: input
})
