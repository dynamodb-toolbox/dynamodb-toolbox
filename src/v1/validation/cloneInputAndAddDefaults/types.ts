import type { PossiblyUndefinedAttributeValue, AttributeValue, Extension } from 'v1/schema'
import type { AttributeDefaultsComputer } from 'v1/entity'

export type ComputeDefaultsContext = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: PossiblyUndefinedAttributeValue[]
}

export type AnyOfAttributeClonedInputsWithDefaults<EXTENSION extends Extension = never> = {
  originalInput: AttributeValue<EXTENSION>
  clonedInputsWithDefaults: AttributeValue<EXTENSION>[]
}

export type CommandName = 'put' | 'update'

export type CloneInputAndAddDefaultsOptions = {
  commandName?: CommandName
  computeDefaultsContext?: ComputeDefaultsContext
}
