import type { PossiblyUndefinedResolvedAttribute, ResolvedAttribute, Extension } from 'v1/schema'
import type { AttributeDefaultsComputer } from 'v1/entity'

export type ComputeDefaultsContext = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: PossiblyUndefinedResolvedAttribute[]
}

export type AnyOfAttributeClonedInputsWithDefaults<EXTENSION extends Extension = never> = {
  originalInput: ResolvedAttribute<EXTENSION>
  clonedInputsWithDefaults: ResolvedAttribute<EXTENSION>[]
}

export type CommandName = 'put' | 'update'

export type CloneInputAndAddDefaultsOptions = {
  commandName?: CommandName
  computeDefaultsContext?: ComputeDefaultsContext
}
