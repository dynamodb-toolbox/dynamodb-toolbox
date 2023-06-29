import type {
  Schema,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  ResolvePrimitiveAttribute
} from 'v1/schema'
import type { FormattedListAttribute } from './list'
import type { FormattedMapAttribute } from './map'
import type { FormattedRecordAttribute } from './record'
import type { FormattedItemOptions } from './utils'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Schema or Attribute
 *
 * @param Schema Schema | Attribute
 * @return Object
 */
export type FormattedAttribute<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormattedItemOptions = FormattedItemOptions
> = SCHEMA extends AnyAttribute
  ? unknown
  : SCHEMA extends PrimitiveAttribute
  ? string extends OPTIONS['attributes']
    ? ResolvePrimitiveAttribute<SCHEMA>
    : never
  : SCHEMA extends SetAttribute
  ? string extends OPTIONS['attributes']
    ? Set<FormattedAttribute<SCHEMA['elements']>>
    : never
  : SCHEMA extends ListAttribute
  ? FormattedListAttribute<SCHEMA, OPTIONS>
  : SCHEMA extends Schema | MapAttribute
  ? FormattedMapAttribute<SCHEMA, OPTIONS>
  : SCHEMA extends RecordAttribute
  ? FormattedRecordAttribute<SCHEMA, OPTIONS>
  : SCHEMA extends AnyOfAttribute
  ? FormattedAttribute<SCHEMA['elements'][number], OPTIONS>
  : never
