import { PossiblyUndefinedResolvedAttribute, AttributeDefaultsComputer } from 'v1'

export type DefaultsComputeOptions = {
  computeDefaults: AttributeDefaultsComputer
  contextInputs: PossiblyUndefinedResolvedAttribute[]
}
