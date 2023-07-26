import type { Attribute, AttributeBasicValue, AttributeValue, Extension, Item } from 'v1/schema'
import type { AttributeDefaultsComputer, SchemaDefaultsComputer } from 'v1/entity'
import type { If } from 'v1/types'

export type HasExtension<EXTENSION extends Extension> = [EXTENSION] extends [never] ? false : true

export type CloningExtensionHandler<EXTENSION extends Extension> = (
  attribute: Attribute,
  input: AttributeValue<EXTENSION> | undefined,
  options: AttributeOptions<EXTENSION>
) =>
  | { isExtension: true; parsedExtension: AttributeValue<EXTENSION>; basicInput?: never }
  | {
      isExtension: false
      parsedExtension?: never
      basicInput: AttributeBasicValue<EXTENSION> | undefined
    }

export type SchemaOptions<EXTENSION extends Extension> = {
  commandName?: CommandName
  computeDefaultsContext?: { computeDefaults: SchemaDefaultsComputer }
} & If<
  HasExtension<EXTENSION>,
  { handleExtension: CloningExtensionHandler<EXTENSION> },
  { handleExtension?: never }
>

export type ComputeDefaultsContext<EXTENSION extends Extension> = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: (Item<EXTENSION> | number | AttributeValue<EXTENSION>)[]
}

export type AttributeOptions<EXTENSION extends Extension> = {
  commandName?: CommandName
  computeDefaultsContext?: ComputeDefaultsContext<EXTENSION>
} & If<
  HasExtension<EXTENSION>,
  { handleExtension: CloningExtensionHandler<EXTENSION> },
  { handleExtension?: never }
>

export type AnyOfAttributeClonedInputsWithDefaults<EXTENSION extends Extension = never> = {
  originalInput: AttributeValue<EXTENSION>
  clonedInputsWithDefaults: AttributeValue<EXTENSION>[]
}

export type CommandName = 'put' | 'update'
