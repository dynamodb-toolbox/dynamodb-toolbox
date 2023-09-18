import type { AttributeValue, Extension, UndefinedAttrExtension } from 'v1/schema'

export type SchemaDefaultsComputer = undefined | Record<string, AttributeDefaultsComputer>

export type AttributeDefaultsComputer<EXTENSION extends Extension = never> =
  | undefined
  | ((...contextInputs: any[]) => AttributeValue<EXTENSION | UndefinedAttrExtension>)
  | {
      _attributes: Record<string, AttributeDefaultsComputer>
      _map?: (...contextInputs: any[]) => AttributeValue<EXTENSION | UndefinedAttrExtension>
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _list?: (...contextInputs: any[]) => AttributeValue<EXTENSION | UndefinedAttrExtension>
    }
  | {
      _elements: AttributeDefaultsComputer | Record<string, AttributeDefaultsComputer>
      _record?: (...contextInputs: any[]) => AttributeValue<EXTENSION | UndefinedAttrExtension>
    }
