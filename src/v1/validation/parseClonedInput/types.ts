import type {
  RequiredOption,
  $savedAs,
  ResolvedPrimitiveAttribute,
  AdditionalResolution,
  ExtractAdditionalResolution,
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
export type ParsedSetAttributeInput<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, 'set'>
  | Set<ParsedAttributeInput<ADDITIONAL_RESOLUTION>>

export type ParsedListAttributeInput<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, 'list'>
  | ParsedAttributeInput<ADDITIONAL_RESOLUTION>[]

// Note: Extracting not needed right now & complex to implement
export type ParsedMapAttributeInput<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput<ADDITIONAL_RESOLUTION>
}

// Note: Extracting not needed right now & complex to implement
export type ParsedRecordAttributeInput<
  ADDITIONAL_RESOLUTION extends AdditionalResolution = never
> = { [key: string]: ParsedAttributeInput<ADDITIONAL_RESOLUTION> }

export type ParsedAttributeInput<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> =
  | ExtractAdditionalResolution<ADDITIONAL_RESOLUTION, PrimitiveAttributeType>
  | ResolvedPrimitiveAttribute
  | ParsedSetAttributeInput<ADDITIONAL_RESOLUTION>
  | ParsedListAttributeInput<ADDITIONAL_RESOLUTION>
  | ParsedMapAttributeInput<ADDITIONAL_RESOLUTION>
  | ParsedRecordAttributeInput<ADDITIONAL_RESOLUTION>

export type ParsedSchemaInput<ADDITIONAL_RESOLUTION extends AdditionalResolution = never> = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput<ADDITIONAL_RESOLUTION>
}
