import type { Attribute, AttributeBasicValue, AttributeValue, Extension, Item } from 'v1/schema'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'

export type ExtensionCloner<
  ATTRIBUTE_EXTENSION extends Extension,
  COMMAND_EXTENSION extends Extension = ATTRIBUTE_EXTENSION
> = (
  attribute: Attribute,
  input: AttributeValue<ATTRIBUTE_EXTENSION> | undefined,
  options: AttributeCloningOptions<ATTRIBUTE_EXTENSION, COMMAND_EXTENSION>
) =>
  | { isExtension: true; clonedExtension: AttributeValue<ATTRIBUTE_EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      clonedExtension?: never
      basicInput: AttributeBasicValue<ATTRIBUTE_EXTENSION> | undefined
    }

export type SchemaCloningOptions<EXTENSION extends Extension> = {
  commandName?: CommandName
} & If<
  HasExtension<EXTENSION>,
  { cloneExtension: ExtensionCloner<EXTENSION> },
  { cloneExtension?: never }
>

export type AttributeCloningOptions<
  EXTENSION extends Extension,
  CONTEXT_EXTENSION extends Extension = EXTENSION
> = {
  commandName?: CommandName
  originalInput: Item<CONTEXT_EXTENSION>
} & If<
  HasExtension<EXTENSION>,
  { cloneExtension: ExtensionCloner<EXTENSION, CONTEXT_EXTENSION> },
  { cloneExtension?: never }
>

export type AnyOfAttributeClonedInputsWithDefaults<EXTENSION extends Extension = never> = {
  originalInput: AttributeValue<EXTENSION>
  clonedInputsWithDefaults: AttributeValue<EXTENSION>[]
}

export type CommandName = 'key' | 'put' | 'update'
