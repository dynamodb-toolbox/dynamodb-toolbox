import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { checkAttributeProperties } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SharedAttributeState } from '../shared/interface.js'
import type { AttrSchema } from '../types/index.js'

export class AnyOfSchema<
  STATE extends SharedAttributeState = SharedAttributeState,
  ELEMENTS extends AttrSchema[] = AttrSchema[]
> {
  type: 'anyOf'
  path?: string
  state: STATE
  elements: ELEMENTS

  constructor(state: STATE, elements: ELEMENTS) {
    this.type = 'anyOf'
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

    if (!isArray(this.elements)) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.invalidElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements must be an array.`,
        path
      })
    }

    if (this.elements.length === 0) {
      throw new DynamoDBToolboxError('schema.anyOfAttribute.missingElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf attributes must have at least one element.`,
        path
      })
    }

    for (const element of this.elements) {
      const { required, hidden, savedAs } = element.state

      if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
        throw new DynamoDBToolboxError('schema.anyOfAttribute.optionalElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements must be required.`,
          path
        })
      }

      if (hidden !== undefined && hidden !== false) {
        throw new DynamoDBToolboxError('schema.anyOfAttribute.hiddenElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be hidden.`,
          path
        })
      }

      if (savedAs !== undefined) {
        throw new DynamoDBToolboxError('schema.anyOfAttribute.savedAsElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be renamed (have savedAs option).`,
          path
        })
      }

      if (hasDefinedDefault(element)) {
        throw new DynamoDBToolboxError('schema.anyOfAttribute.defaultedElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot have default or linked values.`,
          path
        })
      }
    }

    this.elements.forEach((element, index) => {
      element.check(`${path ?? ''}[${index}]`)
    })

    Object.freeze(this.state)
    Object.freeze(this.elements)
    if (path !== undefined) {
      this.path = path
    }
  }
}
