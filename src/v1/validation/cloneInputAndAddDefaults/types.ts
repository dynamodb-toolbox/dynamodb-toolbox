import type {
  PossiblyUndefinedResolvedAttribute,
  ResolvedAttribute,
  AdditionalResolution
} from 'v1/schema'
import type { AttributeDefaultsComputer } from 'v1/entity'

export type ComputeDefaultsContext = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: PossiblyUndefinedResolvedAttribute[]
}

export type AnyOfAttributeClonedInputsWithDefaults<
  ADDITIONAL_RESOLUTION extends AdditionalResolution = never
> = {
  originalInput: ResolvedAttribute<ADDITIONAL_RESOLUTION>
  clonedInputsWithDefaults: ResolvedAttribute<ADDITIONAL_RESOLUTION>[]
}

export type CommandName = 'put' | 'update'

export type CloneInputAndAddDefaultsOptions = {
  commandName?: CommandName
  computeDefaultsContext?: ComputeDefaultsContext
}
