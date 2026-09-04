import { DynamoDBToolboxError } from '~/errors/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import type { SchemaRequiredProp } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import type { ItemAttributes, ItemSchemaProps } from './types.js'

/**
 * Schema for an item, the root object an entity is built from.
 */
export class ItemSchema<
  ATTRIBUTES extends ItemAttributes = ItemAttributes,
  PROPS extends ItemSchemaProps = ItemSchemaProps
> {
  type: 'item'
  attributes: ATTRIBUTES
  props: PROPS

  savedAttributeNames: Set<string>
  keyAttributeNames: Set<string>
  requiredAttributeNames: Record<SchemaRequiredProp, Set<string>>

  /**
   * Instantiate the schema from its attributes and props.
   */
  constructor(attributes: ATTRIBUTES, props: PROPS = {} as PROPS) {
    this.type = 'item'
    this.attributes = attributes
    this.props = props

    this.savedAttributeNames = new Set<string>()
    this.keyAttributeNames = new Set<string>()
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

  /**
   * Whether the schema's props have been validated and frozen.
   */
  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  /**
   * Validate the schema's props and attributes, then freeze them.
   */
  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    const { strict } = this.props

    if (strict !== undefined && !isBoolean(strict)) {
      throw new DynamoDBToolboxError('schema.invalidProp', {
        message: `Invalid prop type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Property: 'strict'. Expected: boolean. Received: ${String(strict)}.`,
        path,
        payload: { propName: 'strict', received: strict }
      })
    }

    const attributesSavedAs = new Set<string>()
    const keyAttributeNames = new Set<string>()
    const requiredAttributeNames: Record<SchemaRequiredProp, Set<string>> = {
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
        throw new DynamoDBToolboxError('schema.item.duplicateSavedAs', {
          message: `Invalid item attributes${
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
