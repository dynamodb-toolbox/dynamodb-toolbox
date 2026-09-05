import { DynamoDBToolboxError } from '~/errors/index.js'

/**
 * `select` option requesting all item attributes.
 */
export type AllAttributesSelectOption = 'ALL_ATTRIBUTES'
/**
 * `select` option requesting all attributes projected into the queried index.
 */
export type AllProjectedAttributesSelectOption = 'ALL_PROJECTED_ATTRIBUTES'
/**
 * `select` option requesting only the matching item count.
 */
export type CountSelectOption = 'COUNT'
/**
 * `select` option requesting a specific set of attributes.
 */
export type SpecificAttributesSelectOption = 'SPECIFIC_ATTRIBUTES'

/**
 * Accepted values for the `select` command option.
 */
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

/**
 * Validate a `select` option value against the queried index and requested attributes.
 */
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
