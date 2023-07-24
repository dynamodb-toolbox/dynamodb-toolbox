import type {
  RequiredOption,
  $savedAs,
  ResolvedPrimitiveAttribute,
  Extension,
  ExtractExtension,
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
  | ExtractExtension<EXTENSION, 'set'>
  | Set<ParsedAttributeInput<EXTENSION>>

export type ParsedListAttributeInput<EXTENSION extends Extension = never> =
  | ExtractExtension<EXTENSION, 'list'>
  | ParsedAttributeInput<EXTENSION>[]

// Note: Extracting not needed right now & complex to implement
export type ParsedMapAttributeInput<EXTENSION extends Extension = never> = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput<EXTENSION>
}

// Note: Extracting not needed right now & complex to implement
export type ParsedRecordAttributeInput<EXTENSION extends Extension = never> = {
  [key: string]: ParsedAttributeInput<EXTENSION>
}

export type ParsedAttributeInput<EXTENSION extends Extension = never> =
  | ExtractExtension<EXTENSION, PrimitiveAttributeType>
  | ResolvedPrimitiveAttribute
  | ParsedSetAttributeInput<EXTENSION>
  | ParsedListAttributeInput<EXTENSION>
  | ParsedMapAttributeInput<EXTENSION>
  | ParsedRecordAttributeInput<EXTENSION>

export type ParsedSchemaInput<EXTENSION extends Extension = never> = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput<EXTENSION>
}
