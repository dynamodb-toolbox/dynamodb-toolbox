import type { ListAttribute } from 'v1/schema'
import type { FormattedAttribute } from './attribute'

export type FormattedListAttribute<
  LIST_ATTRIBUTE extends ListAttribute,
  FILTERED_ATTRIBUTES extends string,
  FORMATTED_ATTRIBUTE = FormattedAttribute<
    LIST_ATTRIBUTE['elements'],
    string extends FILTERED_ATTRIBUTES
      ? string
      : FILTERED_ATTRIBUTES extends `[${number}]`
      ? string
      : FILTERED_ATTRIBUTES extends `[${number}]${infer CHILDREN_FILTERED_ATTRIBUTES}`
      ? CHILDREN_FILTERED_ATTRIBUTES
      : never
  >
> =
  // Possible in case of anyOf subSchema
  [FORMATTED_ATTRIBUTE] extends [never] ? never : FORMATTED_ATTRIBUTE[]
