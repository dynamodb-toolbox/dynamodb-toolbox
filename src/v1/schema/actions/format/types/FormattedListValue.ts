import type { O } from 'ts-toolbelt'

import type { ListAttribute } from 'v1/schema'

import type { FormattedValue } from './FormattedValue'
import type { FormattedValueOptions } from './FormattedValueOptions'

export type FormattedListValue<
  LIST_ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions,
  FORMATTED_ATTRIBUTE = FormattedValue<
    LIST_ATTRIBUTE['elements'],
    O.Update<
      OPTIONS,
      'attributes',
      string extends OPTIONS['attributes'][number]
        ? string[]
        : OPTIONS['attributes'][number] extends `[${number}]`
        ? string[]
        : OPTIONS['attributes'][number] extends `[${number}]${infer CHILDREN_FILTERED_ATTRIBUTES}`
        ? CHILDREN_FILTERED_ATTRIBUTES[]
        : never
    >
  >
> =
  // Possible in case of anyOf subSchema
  [FORMATTED_ATTRIBUTE] extends [never] ? never : FORMATTED_ATTRIBUTE[]
