import type { RequiredOption, $savedAs, ResolvedPrimitiveAttribute } from 'v1/schema'

export interface AttributeFilters {
  key?: boolean
}

export interface ParsingOptions {
  requiringOptions?: Set<RequiredOption>
  filters?: AttributeFilters
}

export type ParsedListAttributeInput = ParsedAttributeInput[]

export type ParsedSetAttributeInput = Set<ParsedAttributeInput>

export type ParsedMapAttributeInput = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput
}

export type ParsedRecordAttributeInput = {
  [key: string]: ParsedAttributeInput
}

export type ParsedAttributeInput =
  | undefined
  | ResolvedPrimitiveAttribute
  | ParsedAttributeInput[]
  | Set<ParsedAttributeInput>
  | ParsedMapAttributeInput
  | ParsedRecordAttributeInput

export type ParsedSchemaInput = {
  [$savedAs]: Record<string, string>
  [key: string]: ParsedAttributeInput
}
