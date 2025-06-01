import { DynamoDBToolboxError } from '~/errors/index.js'

export type AllAttributesSelectOption = 'ALL_ATTRIBUTES'
export type AllProjectedAttributesSelectOption = 'ALL_PROJECTED_ATTRIBUTES'
export type CountSelectOption = 'COUNT'
export type SpecificAttributesSelectOption = 'SPECIFIC_ATTRIBUTES'

export type SelectOption =
  | AllAttributesSelectOption
  | AllProjectedAttributesSelectOption
  | CountSelectOption
  | SpecificAttributesSelectOption

export const selectOptions = [
  'ALL_ATTRIBUTES',
  'ALL_PROJECTED_ATTRIBUTES',
  'COUNT',
  'SPECIFIC_ATTRIBUTES'
] as const satisfies readonly SelectOption[]
export const selectOptionsSet = new Set<SelectOption>(selectOptions)

export const parseSelectOption = (
  select: SelectOption,
  { index, attributes }: { index?: string; attributes?: string[] | undefined } = {}
): SelectOption => {
  if (!selectOptionsSet.has(select)) {
    throw new DynamoDBToolboxError('options.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. 'select' must be one of: ${[
        ...selectOptionsSet
      ].join(', ')}.`,
      payload: { select }
    })
  }

  if (select === 'ALL_PROJECTED_ATTRIBUTES' && index === undefined) {
    throw new DynamoDBToolboxError('options.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. Please provide an 'index' option.`,
      payload: { select }
    })
  }

  if (attributes !== undefined && select !== 'SPECIFIC_ATTRIBUTES') {
    throw new DynamoDBToolboxError('options.invalidSelectOption', {
      message: `Invalid select option: '${String(
        select
      )}'. Select must be 'SPECIFIC_ATTRIBUTES' if a filter expression has been provided.`,
      payload: { select }
    })
  }

  return select
}
