import isEmpty from 'lodash.isempty'

import { DynamoDBToolboxError } from 'v1/errors'
import { SelectOption, selectOptionsSet } from 'v1/operations/constants/options/select'

export const parseSelectOption = (
  select: SelectOption,
  { index, attributes }: { index?: string; attributes?: string[] | undefined } = {}
): SelectOption => {
  if (!selectOptionsSet.has(select)) {
    throw new DynamoDBToolboxError('operations.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. 'select' must be one of: ${[
        ...selectOptionsSet
      ].join(', ')}.`,
      payload: { select }
    })
  }

  if (select === 'ALL_PROJECTED_ATTRIBUTES' && index === undefined) {
    throw new DynamoDBToolboxError('operations.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. Please provide an 'index' option.`,
      payload: { select }
    })
  }

  if (!isEmpty(attributes) && select !== 'SPECIFIC_ATTRIBUTES') {
    throw new DynamoDBToolboxError('operations.invalidSelectOption', {
      message: `Invalid select option: '${String(
        select
      )}'. Select must be 'SPECIFIC_ATTRIBUTES' if a filter expression has been provided.`,
      payload: { select }
    })
  }

  return select
}
