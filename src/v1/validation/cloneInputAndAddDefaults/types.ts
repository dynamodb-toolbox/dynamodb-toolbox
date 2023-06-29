import type { PossiblyUndefinedResolvedAttribute } from 'v1/schema'
import type { AttributeDefaultsComputer } from 'v1/entity'

export type ComputeDefaultsContext = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: PossiblyUndefinedResolvedAttribute[]
}

export type AnyOfAttributeClonedInputsWithDefaults = {
  originalInput: PossiblyUndefinedResolvedAttribute
  clonedInputsWithDefaults: PossiblyUndefinedResolvedAttribute[]
}
