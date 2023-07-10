import type { Attribute } from 'v1/schema'

import type { CommandName, ComputeDefaultsContext } from './types'

export const getCommandDefault = (
  attribute: Attribute,
  { commandName }: { commandName?: CommandName }
): Attribute['defaults']['key' | CommandName] =>
  attribute.key ? attribute.defaults.key : commandName && attribute.defaults[commandName]

export const canComputeDefaults = (
  computeDefaultsContext?: ComputeDefaultsContext
): computeDefaultsContext is ComputeDefaultsContext => computeDefaultsContext !== undefined
