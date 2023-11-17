import isEmpty from 'lodash.isempty'

import { DynamoDBToolboxError } from 'v1/errors'
import { SelectOption, selectOptionsSet } from 'v1/commands/constants/options/select'

export const parseSelectOption = (
  select: SelectOption,
  { indexName, attributes }: { indexName?: string; attributes?: string[] | undefined } = {}
): SelectOption => {
  if (!selectOptionsSet.has(select)) {
    throw new DynamoDBToolboxError('commands.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. 'select' must be one of: ${[
        ...selectOptionsSet
      ].join(', ')}.`,
      payload: { select }
    })
  }

  if (select === 'ALL_PROJECTED_ATTRIBUTES' && indexName === undefined) {
    throw new DynamoDBToolboxError('commands.invalidSelectOption', {
      message: `Invalid select option: '${String(select)}'. Please provide an 'indexName' option.`,
      payload: { select }
    })
  }

  if (!isEmpty(attributes) && select !== 'SPECIFIC_ATTRIBUTES') {
    throw new DynamoDBToolboxError('commands.invalidSelectOption', {
      message: `Invalid select option: '${String(
        select
      )}'. Select must be 'SPECIFIC_ATTRIBUTES' if a filter expression has been provided.`,
      payload: { select }
    })
  }

  return select
}
