import type { O } from 'ts-toolbelt'

import type { OptionalizeUndefinableProperties } from 'v1/types'
import type { Schema, AnyAttribute, Never } from 'v1/schema'
import { DynamoDBToolboxError } from 'v1/errors'
import { isObject } from 'v1/utils/validation'

import type { MatchKeys, FormatOptions, FormattedValueOptions, UnpackFormatOptions } from './types'
import { formatAttrRawValue, AttrFormattedValue } from './attribute'
import { matchProjection } from './utils'

export type SchemaFormattedValue<
  SCHEMA extends Schema,
  OPTIONS extends FormattedValueOptions = FormattedValueOptions,
  MATCHING_KEYS extends string = MatchKeys<
    Extract<keyof SCHEMA['attributes'], string>,
    '',
    OPTIONS['attributes']
  >
> = Schema extends SCHEMA
  ? { [KEY in string]: unknown }
  : // Possible in case of anyOf subSchema
  [MATCHING_KEYS] extends [never]
  ? never
  : OPTIONS extends { partial: true }
  ? {
      // Keep only non-hidden attributes
      [KEY in O.SelectKeys<
        // Pick only filtered keys
        O.Pick<SCHEMA['attributes'], MATCHING_KEYS>,
        { hidden: false }
      >]?: AttrFormattedValue<
        SCHEMA['attributes'][KEY],
        {
          partial: OPTIONS['partial']
          attributes: OPTIONS extends { attributes: string }
            ? KEY extends OPTIONS['attributes']
              ? undefined
              : OPTIONS['attributes'] extends `${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
              ? CHILDREN_FILTERED_ATTRIBUTES
              : never
            : undefined
        }
      >
    }
  : OptionalizeUndefinableProperties<
      {
        // Keep only non-hidden attributes
        [KEY in O.SelectKeys<
          // Pick only filtered keys
          O.Pick<SCHEMA['attributes'], MATCHING_KEYS>,
          { hidden: false }
        >]: AttrFormattedValue<
          SCHEMA['attributes'][KEY],
          {
            partial: OPTIONS['partial']
            attributes: OPTIONS extends { attributes: string }
              ? KEY extends OPTIONS['attributes']
                ? undefined
                : OPTIONS['attributes'] extends `${KEY}${infer CHILDREN_FILTERED_ATTRIBUTES}`
                ? CHILDREN_FILTERED_ATTRIBUTES
                : never
              : undefined
          }
        >
      },
      // Sadly we override optional AnyAttributes as 'unknown | undefined' => 'unknown' (undefined lost in the process)
      O.SelectKeys<SCHEMA['attributes'], AnyAttribute & { required: Never }>
    >

export const formatSchemaRawValue = <
  SCHEMA extends Schema,
  OPTIONS extends FormatOptions = FormatOptions
>(
  schema: SCHEMA,
  rawValue: unknown,
  { attributes, partial = false }: OPTIONS = {} as OPTIONS
): SchemaFormattedValue<SCHEMA, UnpackFormatOptions<OPTIONS>> => {
  if (!isObject(rawValue)) {
    throw new DynamoDBToolboxError('formatter.invalidItem', {
      message: 'Invalid item detected while formatting. Should be an object.',
      payload: {
        received: rawValue,
        expected: 'Object'
      }
    })
  }

  const formattedValue: Record<string, unknown> = {}

  Object.entries(schema.attributes).forEach(([attributeName, attribute]) => {
    if (attribute.hidden) {
      return
    }

    const { isProjected, childrenAttributes } = matchProjection(
      new RegExp('^' + attributeName),
      attributes
    )

    if (!isProjected) {
      return
    }

    const attributeSavedAs = attribute.savedAs ?? attributeName

    const formattedAttribute = formatAttrRawValue(attribute, rawValue[attributeSavedAs], {
      attributes: childrenAttributes,
      partial
    })

    if (formattedAttribute !== undefined) {
      formattedValue[attributeName] = formattedAttribute
    }
  })

  return formattedValue as SchemaFormattedValue<SCHEMA, UnpackFormatOptions<OPTIONS>>
}
