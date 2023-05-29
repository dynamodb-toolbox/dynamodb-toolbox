import type { PossiblyUndefinedResolvedAttribute } from 'v1/schema'

export type SchemaDefaultsComputer = undefined | Record<string, AttributeDefaultsComputer>

export type AttributeDefaultsComputer =
  | undefined
  | ((...contextInputs: any[]) => PossiblyUndefinedResolvedAttribute)
  | {
      _attributes: Record<string, AttributeDefaultsComputer>
      _map?: (...contextInputs: any[]) => PossiblyUndefinedResolvedAttribute
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _list?: (...contextInputs: any[]) => PossiblyUndefinedResolvedAttribute
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _record?: (...contextInputs: any[]) => PossiblyUndefinedResolvedAttribute
    }
