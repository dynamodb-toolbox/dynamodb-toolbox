import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkSchemaProps } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SchemaProps } from '../shared/props.js'
import type { StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'

export class RecordSchema<
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema,
  PROPS extends SchemaProps = SchemaProps
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
        }: Record keys cannot be renamed (have savedAs option).`,
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
        }: Record elements cannot be renamed (have savedAs option).`,
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
