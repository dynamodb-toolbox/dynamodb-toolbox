import { ExtensionRenamer } from './types'

export const defaultRenameExtension: ExtensionRenamer<never> = input => ({
  isExtension: false,
  basicInput: input
})
