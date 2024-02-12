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
  ResolveAnyAttribute,
  ResolvePrimitiveAttribute
} from 'v1/schema'

import type { FormattedListValue } from './FormattedListValue'
import type { FormattedMapValue } from './FormattedMapValue'
import type { FormattedRecordValue } from './FormattedRecordValue'
import type { FormattedValueOptions } from './FormattedValueOptions'

/**
 * Returns the type of formatted values for a given Schema or Attribute
 *
 * @param Schema Schema | Attribute
 * @return Object
 */
export type FormattedValue<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions
> = SCHEMA extends AnyAttribute
  ? ResolveAnyAttribute<SCHEMA>
  : SCHEMA extends PrimitiveAttribute
  ? string extends OPTIONS['attributes'][number]
    ? ResolvePrimitiveAttribute<SCHEMA>
    : never
  : SCHEMA extends SetAttribute
  ? string extends OPTIONS['attributes'][number]
    ? Set<FormattedValue<SCHEMA['elements']>>
    : never
  : SCHEMA extends ListAttribute
  ? FormattedListValue<SCHEMA, OPTIONS>
  : SCHEMA extends Schema | MapAttribute
  ? FormattedMapValue<SCHEMA, OPTIONS>
  : SCHEMA extends RecordAttribute
  ? FormattedRecordValue<SCHEMA, OPTIONS>
  : SCHEMA extends AnyOfAttribute
  ? FormattedValue<SCHEMA['elements'][number], OPTIONS>
  : never
