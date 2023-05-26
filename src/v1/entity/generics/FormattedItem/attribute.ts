import type {
  Item,
  Attribute,
  AnyAttribute,
  PrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute,
  ResolvePrimitiveAttribute
} from 'v1/item'
import type { FormattedListAttribute } from './list'
import type { FormattedMapAttribute } from './map'
import type { FormattedRecordAttribute } from './record'

/**
 * Returned item of a fetch command (GET, QUERY ...) for a given Item or Attribute
 *
 * @param Schema Item | Attribute
 * @return Object
 */
export type FormattedAttribute<
  SCHEMA extends Item | Attribute,
  FILTERED_ATTRIBUTES extends string = string
> = SCHEMA extends AnyAttribute
  ? unknown
  : SCHEMA extends PrimitiveAttribute
  ? string extends FILTERED_ATTRIBUTES
    ? ResolvePrimitiveAttribute<SCHEMA>
    : never
  : SCHEMA extends SetAttribute
  ? string extends FILTERED_ATTRIBUTES
    ? Set<FormattedAttribute<SCHEMA['elements']>>
    : never
  : SCHEMA extends ListAttribute
  ? FormattedListAttribute<SCHEMA, FILTERED_ATTRIBUTES>
  : SCHEMA extends Item | MapAttribute
  ? FormattedMapAttribute<SCHEMA, FILTERED_ATTRIBUTES>
  : SCHEMA extends RecordAttribute
  ? FormattedRecordAttribute<SCHEMA, FILTERED_ATTRIBUTES>
  : SCHEMA extends AnyOfAttribute
  ? FormattedAttribute<SCHEMA['elements'][number], FILTERED_ATTRIBUTES>
  : never
