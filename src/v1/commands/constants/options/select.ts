export type AllAttributesSelectOption = 'ALL_ATTRIBUTES'
export type AllProjectedAttributesSelectOption = 'ALL_PROJECTED_ATTRIBUTES'
export type CountSelectOption = 'COUNT'
export type SpecificAttributesSelectOption = 'SPECIFIC_ATTRIBUTES'

export type SelectOption =
  | AllAttributesSelectOption
  | AllProjectedAttributesSelectOption
  | CountSelectOption
  | SpecificAttributesSelectOption

export const selectOptionsSet = new Set<SelectOption>([
  'ALL_ATTRIBUTES',
  'ALL_PROJECTED_ATTRIBUTES',
  'COUNT',
  'SPECIFIC_ATTRIBUTES'
])
