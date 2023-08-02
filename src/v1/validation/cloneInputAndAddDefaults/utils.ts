import type { Attribute, Extension } from 'v1/schema'

import type { ExtensionCloner, CommandName, ComputeDefaultsContext } from './types'

export const getCommandDefault = (
  attribute: Attribute,
  { commandName }: { commandName?: CommandName }
): Attribute['defaults']['key' | CommandName] =>
  attribute.key ? attribute.defaults.key : commandName && attribute.defaults[commandName]

export const canComputeDefaults = <EXTENSION extends Extension>(
  computeDefaultsContext?: ComputeDefaultsContext<EXTENSION>
): computeDefaultsContext is ComputeDefaultsContext<EXTENSION> =>
  computeDefaultsContext !== undefined

export const defaultCloneExtension: ExtensionCloner<never> = (_, input) => ({
  isExtension: false,
  basicInput: input
})
