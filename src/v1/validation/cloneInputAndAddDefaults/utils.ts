import type { Attribute } from 'v1/schema'

import type { ExtensionCloner, operationName } from './types'

export const getCommandDefault = (
  attribute: Attribute,
  { operationName }: { operationName?: operationName }
): Attribute['defaults']['key' | operationName] =>
  attribute.key ? attribute.defaults.key : operationName && attribute.defaults[operationName]

export const defaultCloneExtension: ExtensionCloner<never, never> = (_, input) => ({
  isExtension: false,
  basicInput: input
})
