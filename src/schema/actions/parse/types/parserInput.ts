import type { O } from 'ts-toolbelt'

import type { If } from '~/types/if.js'
import type { Schema } from '~/schema/index.js'
import type {
  AtLeastOnce,
  Always,
  Never,
  Attribute,
  AnyAttribute,
  ResolveAnyAttribute,
  PrimitiveAttribute,
  ResolvePrimitiveAttribute,
  SetAttribute,
  ListAttribute,
  MapAttribute,
  RecordAttribute,
  AnyOfAttribute
} from '~/schema/attributes/index.js'
import type { OptionalizeUndefinableProperties } from '~/types/optionalizeUndefinableProperties.js'

import type { ParsedValueOptions, ParsedValueDefaultOptions } from '../types/options.js'

type MustBeDefined<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = OPTIONS extends { fill: false }
  ? ATTRIBUTE extends { required: AtLeastOnce | Always }
    ? true
    : false
  : ATTRIBUTE extends { required: AtLeastOnce | Always } & (
      | {
          key: true
          defaults: { key: undefined }
          links: { key: undefined }
        }
      | {
          key: false
          defaults: { put: undefined }
          links: { put: undefined }
        }
    )
  ? true
  : false

type SchemaParserInput<
  SCHEMA extends Schema,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = Schema extends SCHEMA
  ? { [KEY: string]: AttrParserInput<Attribute, OPTIONS> }
  : SCHEMA extends Schema
  ? OptionalizeUndefinableProperties<
      {
        [KEY in OPTIONS extends { mode: 'key' }
          ? O.SelectKeys<SCHEMA['attributes'], { key: true }>
          : keyof SCHEMA['attributes'] & string]: AttrParserInput<
          SCHEMA['attributes'][KEY],
          OPTIONS
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >
  : never

type AttrParserInput<
  ATTRIBUTE extends Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = Attribute extends ATTRIBUTE
  ? unknown
  :
      | If<MustBeDefined<ATTRIBUTE, OPTIONS>, never, undefined>
      | (ATTRIBUTE extends AnyAttribute
          ? ResolveAnyAttribute<ATTRIBUTE>
          : ATTRIBUTE extends PrimitiveAttribute
          ? ResolvePrimitiveAttribute<ATTRIBUTE>
          : ATTRIBUTE extends SetAttribute
          ? Set<AttrParserInput<ATTRIBUTE['elements'], OPTIONS>>
          : ATTRIBUTE extends ListAttribute
          ? AttrParserInput<ATTRIBUTE['elements'], OPTIONS>[]
          : ATTRIBUTE extends MapAttribute
          ? OptionalizeUndefinableProperties<
              {
                [KEY in OPTIONS extends { mode: 'key' }
                  ? O.SelectKeys<ATTRIBUTE['attributes'], { key: true }>
                  : keyof ATTRIBUTE['attributes'] & string]: AttrParserInput<
                  ATTRIBUTE['attributes'][KEY],
                  OPTIONS
                >
              },
              // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
              O.SelectKeys<ATTRIBUTE['attributes'], AnyAttribute & { required: Never }>
            >
          : ATTRIBUTE extends RecordAttribute
          ? {
              [KEY in ResolvePrimitiveAttribute<ATTRIBUTE['keys']>]?: AttrParserInput<
                ATTRIBUTE['elements'],
                OPTIONS
              >
            }
          : ATTRIBUTE extends AnyOfAttribute
          ? AttrParserInput<ATTRIBUTE['elements'][number], OPTIONS>
          : never)

export type ParserInput<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends ParsedValueOptions = ParsedValueDefaultOptions
> = SCHEMA extends Schema
  ? SchemaParserInput<SCHEMA, OPTIONS>
  : SCHEMA extends Attribute
  ? AttrParserInput<SCHEMA, OPTIONS>
  : never
