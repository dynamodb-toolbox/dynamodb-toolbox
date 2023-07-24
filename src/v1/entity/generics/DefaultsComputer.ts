import type { PossiblyUndefinedAttributeValue } from 'v1/schema'

export type SchemaDefaultsComputer = undefined | Record<string, AttributeDefaultsComputer>

export type AttributeDefaultsComputer =
  | undefined
  | ((...contextInputs: any[]) => PossiblyUndefinedAttributeValue)
  | {
      _attributes: Record<string, AttributeDefaultsComputer>
      _map?: (...contextInputs: any[]) => PossiblyUndefinedAttributeValue
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _list?: (...contextInputs: any[]) => PossiblyUndefinedAttributeValue
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _record?: (...contextInputs: any[]) => PossiblyUndefinedAttributeValue
    }
