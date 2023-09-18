import type { Attribute, AttributeBasicValue, AttributeValue, Extension, Item } from 'v1/schema'
import type { AttributeDefaultsComputer, SchemaDefaultsComputer } from 'v1/entity'
import type { If } from 'v1/types'

import type { HasExtension } from '../types'

export type ExtensionCloner<EXTENSION extends Extension> = (
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  options: AttributeCloningOptions<EXTENSION>
) =>
  | { isExtension: true; clonedExtension: AttributeValue<EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      clonedExtension?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    }

export type SchemaCloningOptions<EXTENSION extends Extension> = {
  commandName?: CommandName
  computeDefaultsContext?: { computeDefaults: SchemaDefaultsComputer<EXTENSION> }
} & If<
  HasExtension<EXTENSION>,
  { cloneExtension: ExtensionCloner<EXTENSION> },
  { cloneExtension?: never }
>

export type ComputeDefaultsContext<EXTENSION extends Extension> = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: (Item<EXTENSION> | number | AttributeValue<EXTENSION>)[]
}

export type AttributeCloningOptions<EXTENSION extends Extension> = {
  commandName?: CommandName
  computeDefaultsContext?: ComputeDefaultsContext<EXTENSION>
} & If<
  HasExtension<EXTENSION>,
  { cloneExtension: ExtensionCloner<EXTENSION> },
  { cloneExtension?: never }
>

export type AnyOfAttributeClonedInputsWithDefaults<EXTENSION extends Extension = never> = {
  originalInput: AttributeValue<EXTENSION>
  clonedInputsWithDefaults: AttributeValue<EXTENSION>[]
}

export type CommandName = 'put' | 'update'
