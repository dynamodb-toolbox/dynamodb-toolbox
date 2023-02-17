import type { PossiblyUndefinedResolvedAttribute } from 'v1/item'

export type ItemDefaultsComputer = undefined | Record<string, AttributeDefaultsComputer>

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
