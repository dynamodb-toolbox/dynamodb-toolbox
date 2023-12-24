import type {
  $savedAs,
  $transform,
  $keys,
  $elements,
  ResolvedPrimitiveAttribute,
  Extension,
  ExtendedValue,
  PrimitiveAttributeType,
  Transformer
} from 'v1/schema'

export type HasExtension<EXTENSION extends Extension> = [EXTENSION] extends [never] ? false : true

/**
 * @debt refactor "note: All those types are just to add the $savedAs secret prop to items & maps. Maybe we can update ResolvedX types to incorporate them"
 */
export type PrimitiveAttributeParsedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, PrimitiveAttributeType>
  | PrimitiveAttributeParsedBasicValue

export type PrimitiveAttributeParsedBasicValue = ResolvedPrimitiveAttribute

export type SetAttributeParsedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | SetAttributeParsedBasicValue<EXTENSION>

export type SetAttributeParsedBasicValue<EXTENSION extends Extension = never> = {
  [$transform]?: Transformer
} & Set<AttributeParsedValue<EXTENSION>>

export type ListAttributeParsedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ListAttributeParsedBasicValue<EXTENSION>

export type ListAttributeParsedBasicValue<EXTENSION extends Extension = never> = {
  [$transform]?: Transformer
} & AttributeParsedValue<EXTENSION>[]

export type MapAttributeParsedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | MapAttributeParsedBasicValue<EXTENSION>

export type MapAttributeParsedBasicValue<EXTENSION extends Extension = never> = {
  [$savedAs]?: Record<string, string>
  [$transform]?: Record<string, Transformer>
  [key: string]: AttributeParsedValue<EXTENSION>
}

export type RecordAttributeParsedValue<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | RecordAttributeParsedBasicValue<EXTENSION>

export type RecordAttributeParsedBasicValue<EXTENSION extends Extension = never> = {
  [$transform]?: Partial<Record<$keys | $elements, Transformer>>
  [key: string]: AttributeParsedValue<EXTENSION>
}

export type AttributeParsedValue<EXTENSION extends Extension = never> =
  | PrimitiveAttributeParsedValue<EXTENSION>
  | SetAttributeParsedValue<EXTENSION>
  | ListAttributeParsedValue<EXTENSION>
  | MapAttributeParsedValue<EXTENSION>
  | RecordAttributeParsedValue<EXTENSION>

export type AttributeParsedBasicValue<EXTENSION extends Extension = never> =
  | PrimitiveAttributeParsedBasicValue
  | SetAttributeParsedBasicValue<EXTENSION>
  | ListAttributeParsedBasicValue<EXTENSION>
  | MapAttributeParsedBasicValue<EXTENSION>
  | RecordAttributeParsedBasicValue<EXTENSION>

export type ParsedItem<EXTENSION extends Extension = never> = {
  [$savedAs]?: Record<string, string>
  [$transform]?: Record<string, Transformer>
  [key: string]: AttributeParsedValue<EXTENSION>
}
