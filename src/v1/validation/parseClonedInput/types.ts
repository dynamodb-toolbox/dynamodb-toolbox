import type {
  RequiredOption,
  $savedAs,
  ResolvedPrimitiveAttribute,
  Extension,
  ExtendedValue,
  PrimitiveAttributeType
} from 'v1/schema'

export interface AttributeFilters {
  key?: boolean
}

export interface ParsingOptions {
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
}

/**
 * @debt refactor "note: All those types are just to add the $savedAs secret prop to items & maps. Maybe we can update ResolvedX types to incorporate them"
 */
export type ParsedSetAttributeInput<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'set'>
  | Set<ParsedAttributeInput<EXTENSION>>

export type ParsedListAttributeInput<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'list'>
  | ParsedAttributeInput<EXTENSION>[]

export type ParsedMapAttributeInput<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'map'>
  | {
      [$savedAs]: Record<string, string>
      [key: string]: ParsedAttributeInput<EXTENSION>
    }

export type ParsedRecordAttributeInput<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, 'record'>
  | { [key: string]: ParsedAttributeInput<EXTENSION> }

export type ParsedAttributeInput<EXTENSION extends Extension = never> =
  | ExtendedValue<EXTENSION, PrimitiveAttributeType>
  | ResolvedPrimitiveAttribute
  | ParsedSetAttributeInput<EXTENSION>
  | ParsedListAttributeInput<EXTENSION>
  | ParsedMapAttributeInput<EXTENSION>
  | ParsedRecordAttributeInput<EXTENSION>

export type ParsedSchemaInput<EXTENSION extends Extension = never> = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput<EXTENSION>
}
