import type { PossiblyUndefinedResolvedAttribute } from 'v1/schema'

export type AnyOfAttributeClonedInputsWithDefaults = {
  originalInput: PossiblyUndefinedResolvedAttribute
  clonedInputsWithDefaults: PossiblyUndefinedResolvedAttribute[]
}

export type ParsedAnyOfAttributeCommandInput = {
  subSchemaIndex: number
  parsedInput: PossiblyUndefinedResolvedAttribute
}
