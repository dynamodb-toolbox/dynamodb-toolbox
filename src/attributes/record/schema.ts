import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkAttributeProperties } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { StringSchema } from '../string/index.js'
import type { AttrSchema } from '../types/index.js'

export class RecordSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  KEYS extends StringSchema = StringSchema,
  ELEMENTS extends AttrSchema = AttrSchema
> {
  type: 'record'
  keys: KEYS
  elements: ELEMENTS
  state: STATE

  constructor(state: STATE, keys: KEYS, elements: ELEMENTS) {
    this.type = 'record'
    this.keys = keys
    this.elements = elements
    this.state = state
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkAttributeProperties(this.state, path)

    if (this.keys.type !== 'string') {
      throw new DynamoDBToolboxError('schema.recordAttribute.invalidKeys', {
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
    } = this.keys.state

    // Checking $key before $required as $key implies attribute is always $required
    if (keysKey !== undefined && keysKey !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.keyKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be part of primary key.`,
        path
      })
    }

    if (keysRequired !== undefined && keysRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.recordAttribute.optionalKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys must be required.`,
        path
      })
    }

    if (keysHidden !== undefined && keysHidden !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.hiddenKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be hidden.`,
        path
      })
    }

    if (keysSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.recordAttribute.savedAsKeys', {
        message: `Invalid record keys${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record keys cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.keys)) {
      throw new DynamoDBToolboxError('schema.recordAttribute.defaultedKeys', {
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
    } = this.elements.state

    // Checking $key before $required as $key implies attribute is always $required
    if (elementsKey !== undefined && elementsKey !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.keyElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be part of primary key.`,
        path
      })
    }

    if (elementsRequired !== undefined && elementsRequired !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.recordAttribute.optionalElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements must be required.`,
        path
      })
    }

    if (elementsHidden !== undefined && elementsHidden !== false) {
      throw new DynamoDBToolboxError('schema.recordAttribute.hiddenElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be hidden.`,
        path
      })
    }

    if (elementsSavedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.recordAttribute.savedAsElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Record elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.recordAttribute.defaultedElements', {
        message: `Invalid record elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Records elements cannot have default or linked values.`,
        path
      })
    }

    this.keys.check(path && `${path} (KEY)`)
    this.elements.check(`${path ?? ''}[string]`)

    Object.freeze(this.state)
    Object.freeze(this.keys)
    Object.freeze(this.elements)
  }
}
