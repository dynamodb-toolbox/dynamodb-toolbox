import type { Item, Schema, SchemaAction } from 'v1/schema'
import type { AnyAttributePath } from 'v1/operations/types'

import type { FormattedValue } from './types'
import { formatSavedAttribute } from './attribute'
import { matchProjection } from './utils'

export type FormatOptions<SCHEMA extends Schema = Schema> = {
  attributes?: AnyAttributePath<SCHEMA>[]
  partial?: boolean
}

export class Formatter<SCHEMA extends Schema = Schema> implements SchemaAction<SCHEMA> {
  schema: SCHEMA

  constructor(schema: SCHEMA) {
    this.schema = schema
  }

  format<OPTIONS extends FormatOptions<SCHEMA>>(
    rawValue: Item,
    { attributes, partial = false }: OPTIONS = {} as OPTIONS
  ): FormattedValue<
    SCHEMA,
    {
      attributes: OPTIONS['attributes'] extends string[] ? OPTIONS['attributes'] : string[]
      partial: OPTIONS extends { partial: boolean } ? OPTIONS['partial'] : false
    }
  > {
    const formattedValue: Item = {}

    Object.entries(this.schema.attributes).forEach(([attributeName, attribute]) => {
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

      const formattedAttribute = formatSavedAttribute(attribute, rawValue[attributeSavedAs], {
        attributes: childrenAttributes,
        partial
      })

      if (formattedAttribute !== undefined) {
        formattedValue[attributeName] = formattedAttribute
      }
    })

    return formattedValue as any
  }
}
