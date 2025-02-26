import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkAttributeProperties } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { SetElementSchema } from './types.js'

export class SetSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends SetElementSchema = SetElementSchema
> {
  type: 'set'
  path?: string
  elements: ELEMENTS
  state: STATE

  constructor(state: STATE, elements: ELEMENTS) {
    this.type = 'set'
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

    const { required, hidden, savedAs } = this.elements.state

    if (required !== undefined && required !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.setAttribute.optionalElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.setAttribute.hiddenElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.setAttribute.savedAsElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.setAttribute.defaultedElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot have default or linked values.`,
        path
      })
    }

    this.elements.check(`${path ?? ''}[x]`)

    Object.freeze(this.state)
    Object.freeze(this.elements)
    if (path !== undefined) {
      this.path = path
    }
  }
}
