import type { Attribute } from 'v1/schema'

import type { ExtensionCloner, CommandName } from './types'

export const getCommandDefault = (
  attribute: Attribute,
  { commandName }: { commandName?: CommandName }
): Attribute['defaults']['key' | CommandName] =>
  attribute.key ? attribute.defaults.key : commandName && attribute.defaults[commandName]

export const defaultCloneExtension: ExtensionCloner<never, never> = (_, input) => ({
  isExtension: false,
  basicInput: input
})
