import { DynamoDBToolboxError } from '~/errors/index.js'

import type { RequiredOption } from '../constants/index.js'
import { checkAttributeProperties } from '../shared/check.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { MapAttributesSchemas } from './types.js'

export class MapSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  ATTRIBUTES extends MapAttributesSchemas = MapAttributesSchemas
> {
  type: 'map'
  attributes: ATTRIBUTES
  state: STATE

  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<RequiredOption, Set<string>>

  constructor(state: STATE, attributes: ATTRIBUTES) {
    this.type = 'map'
    this.attributes = attributes
    this.state = state

    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<RequiredOption, Set<string>> = {
      always: new Set(),
      atLeastOnce: new Set(),
      never: new Set()
    }

    for (const [attributeName, attribute] of Object.entries(attributes)) {
      const { key = false, required = 'atLeastOnce' } = attribute.state
      if (key) {
        keyAttributeNames.add(attributeName)
      }

      requiredAttributeNames[required].add(attributeName)
    }

    this.keyAttributeNames = keyAttributeNames
    this.requiredAttributeNames = requiredAttributeNames
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkAttributeProperties(this.state, path)

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
      } = attribute.state

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

    Object.freeze(this.state)
    Object.freeze(this.attributes)
    Object.freeze(this.keyAttributeNames)
    Object.freeze(this.requiredAttributeNames)
  }
}
