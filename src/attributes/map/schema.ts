import { DynamoDBToolboxError } from '~/errors/index.js'

import type { RequiredOption } from '../constants/index.js'
import { checkSchemaProps } from '../shared/check.js'
import type { SchemaProps } from '../shared/props.js'
import type { MapAttributes } from './types.js'

export class MapSchema<
  PROPS extends SchemaProps = SchemaProps,
  ATTRIBUTES extends MapAttributes = MapAttributes
> {
  type: 'map'
  attributes: ATTRIBUTES
  props: PROPS

  keyAttributeNames: Set<string>
  savedAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>

  constructor(props: PROPS, attributes: ATTRIBUTES) {
    this.type = 'map'
    this.attributes = attributes
    this.props = props

    this.keyAttributeNames = new Set<string>()
    this.savedAttributeNames = new Set<string>()
    this.requiredAttributeNames = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    for (const [attributeName, attribute] of Object.entries(attributes)) {
      const { key = false, required = 'atLeastOnce', savedAs = attributeName } = attribute.props

      this.savedAttributeNames.add(savedAs)
      if (key) {
        this.keyAttributeNames.add(attributeName)
      }
      this.requiredAttributeNames[required].add(attributeName)
    }
  }

  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    const attributesSavedAs = new Set<string>()
    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    for (const [attributeName, attribute] of Object.entries(this.attributes)) {
      const {
        savedAs: attributeSavedAs = attributeName,
        key: attributeKey,
        required: attributeRequired = 'atLeastOnce'
      } = attribute.props

      if (attributesSavedAs.has(attributeSavedAs)) {
        throw new DynamoDBToolboxError('schema.mapAttribute.duplicateSavedAs', {
          message: `Invalid map attributes${
            path !== undefined ? ` at path '${path}'` : ''
          }: More than two attributes are saved as '${attributeSavedAs}'.`,
          path,
          payload: { savedAs: attributeSavedAs }
        })
      }

      attributesSavedAs.add(attributeSavedAs)

      if (attributeKey !== undefined && attributeKey) {
        keyAttributeNames.add(attributeName)
      }

      requiredAttributeNames[attributeRequired].add(attributeName)
    }

    for (const [attributeName, attribute] of Object.entries(this.attributes)) {
      attribute.check([path, attributeName].filter(Boolean).join('.'))
    }

    Object.freeze(this.props)
    Object.freeze(this.attributes)
    Object.freeze(this.savedAttributeNames)
    Object.freeze(this.keyAttributeNames)
    Object.freeze(this.requiredAttributeNames)
  }
}
