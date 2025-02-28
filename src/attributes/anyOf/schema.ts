import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import { checkSchemaProps } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SchemaProps } from '../shared/props.js'
import type { AttrSchema } from '../types/index.js'

export class AnyOfSchema<
  PROPS extends SchemaProps = SchemaProps,
  ELEMENTS extends AttrSchema[] = AttrSchema[]
> {
  type: 'anyOf'
  props: PROPS
  elements: ELEMENTS

  constructor(props: PROPS, elements: ELEMENTS) {
    this.type = 'anyOf'
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

    if (!isArray(this.elements)) {
      throw new DynamoDBToolboxError('schema.anyOf.invalidElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf elements must be an array.`,
        path
      })
    }

    if (this.elements.length === 0) {
      throw new DynamoDBToolboxError('schema.anyOf.missingElements', {
        message: `Invalid anyOf elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: AnyOf attributes must have at least one element.`,
        path
      })
    }

    for (const element of this.elements) {
      const { required, hidden, savedAs } = element.props

      if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
        throw new DynamoDBToolboxError('schema.anyOf.optionalElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements must be required.`,
          path
        })
      }

      if (hidden !== undefined && hidden !== false) {
        throw new DynamoDBToolboxError('schema.anyOf.hiddenElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be hidden.`,
          path
        })
      }

      if (savedAs !== undefined) {
        throw new DynamoDBToolboxError('schema.anyOf.savedAsElements', {
          message: `Invalid anyOf elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: AnyOf elements cannot be renamed (have savedAs option).`,
          path
        })
      }

      if (hasDefinedDefault(element)) {
        throw new DynamoDBToolboxError('schema.anyOf.defaultedElements', {
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

    Object.freeze(this.props)
    Object.freeze(this.elements)
  }
}
