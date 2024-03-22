import type { Schema } from 'v1/schema/schema'
import type { Attribute } from 'v1/schema/attributes'
import type { Paths } from 'v1/schema/actions/paths'

export type FormatOptions<SCHEMA extends Schema | Attribute> = {
  attributes?: Paths<SCHEMA>[]
  partial?: boolean
}

export type FormattedValueOptions<SCHEMA extends Schema | Attribute> = {
  attributes?: Paths<SCHEMA>
  partial?: boolean
}

export type FormattedValueDefaultOptions = {
  attributes: undefined
  partial: false
}

export type FromFormatOptions<
  SCHEMA extends Schema | Attribute,
  OPTIONS extends FormatOptions<SCHEMA>
> = {
  attributes: OPTIONS extends { attributes: Paths<SCHEMA>[] }
    ? OPTIONS['attributes'][number]
    : FormattedValueDefaultOptions['attributes']
  partial: OPTIONS extends { partial: boolean }
    ? OPTIONS['partial']
    : FormattedValueDefaultOptions['partial']
}

export type MatchKeys<
  KEYS extends string,
  KEY_PREFIX extends string,
  FILTERED_ATTRIBUTES extends string | undefined
> = FILTERED_ATTRIBUTES extends string
  ? KEYS extends infer KEY
    ? KEY extends string
      ? FILTERED_ATTRIBUTES extends `${KEY_PREFIX}${KEY}${string}`
        ? KEY
        : never
      : never
    : never
  : KEYS
