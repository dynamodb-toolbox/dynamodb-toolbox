import { DynamoDBToolboxError } from '~/errors/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import type { StringSchema } from '../string/index.js'
import type { Schema } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import { hasDefinedDefault } from '../utils/hasDefinedDefault.js'
import type { RecordSchemaProps } from './types.js'

export class RecordSchema<
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends Schema = Schema,
  PROPS extends RecordSchemaProps = RecordSchemaProps
> {
  type: 'record'
  keys: KEYS
  elements: ELEMENTS
  props: PROPS

  constructor(keys: KEYS, elements: ELEMENTS, props: PROPS) {
    this.type = 'record'
    this.keys = keys
    this.elements = elements
    this.props = props
  }

  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    const { partial } = this.props

    if (partial !== undefined && !isBoolean(partial)) {
      throw new DynamoDBToolboxError('schema.invalidProp', {
        message: `Invalid property type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Property: 'partial'. Expected: boolean. Received: ${String(partial)}.`,
        path,
        payload: { propName: 'partial', received: partial }
      })
    }

    if (this.keys.type !== 'string') {
      throw new DynamoDBToolboxError('schema.record.invalidKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys must be a string.`,
        path
      })
    }

    const {
      required: keysRequired,
      hidden: keysHidden,
      key: keysKey,
      savedAs: keysSavedAs
    } = this.keys.props

    // Checking $key before $required as $key implies attribute is always $required
    if (keysKey !== undefined && keysKey !== false) {
      throw new DynamoDBToolboxError('schema.record.keyKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be part of primary key.`,
        path
      })
    }

    if (keysRequired !== undefined && keysRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.record.optionalKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys must be required.`,
        path
      })
    }

    if (keysHidden !== undefined && keysHidden !== false) {
      throw new DynamoDBToolboxError('schema.record.hiddenKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be hidden.`,
        path
      })
    }

    if (keysSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.record.savedAsKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be renamed (have savedAs prop).`,
        path
      })
    }

    if (hasDefinedDefault(this.keys)) {
      throw new DynamoDBToolboxError('schema.record.defaultedKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot have default or linked values.`,
        path
      })
    }

    const {
      key: elementsKey,
      required: elementsRequired,
      hidden: elementsHidden,
      savedAs: elementsSavedAs
    } = this.elements.props

    // Checking $key before $required as $key implies attribute is always $required
    if (elementsKey !== undefined && elementsKey !== false) {
      throw new DynamoDBToolboxError('schema.record.keyElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be part of primary key.`,
        path
      })
    }

    if (elementsRequired !== undefined && elementsRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.record.optionalElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements must be required.`,
        path
      })
    }

    if (elementsHidden !== undefined && elementsHidden !== false) {
      throw new DynamoDBToolboxError('schema.record.hiddenElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be hidden.`,
        path
      })
    }

    if (elementsSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.record.savedAsElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be renamed (have savedAs prop).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.record.defaultedElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Records elements cannot have default or linked values.`,
        path
      })
    }

    this.keys.check(path && `${path} (KEY)`)
    this.elements.check(`${path ?? ''}[string]`)

    Object.freeze(this.props)
    Object.freeze(this.keys)
    Object.freeze(this.elements)
  }
}
