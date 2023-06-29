import type { ListAttribute } from 'v1/schema'

import type { FormattedAttribute } from './attribute'
import type { FormattedItemOptions } from './utils'

export type FormattedListAttribute<
  LIST_ATTRIBUTE extends ListAttribute,
  OPTIONS extends FormattedItemOptions = FormattedItemOptions,
  FORMATTED_ATTRIBUTE = FormattedAttribute<
    LIST_ATTRIBUTE['elements'],
    {
      attributes: string extends OPTIONS['attributes']
        ? string
        : OPTIONS['attributes'] extends `[${number}]`
        ? string
        : OPTIONS['attributes'] extends `[${number}]${infer CHILDREN_FILTERED_ATTRIBUTES}`
        ? CHILDREN_FILTERED_ATTRIBUTES
        : never
    }
  >
> =
  // Possible in case of anyOf subSchema
  [FORMATTED_ATTRIBUTE] extends [never] ? never : FORMATTED_ATTRIBUTE[]
