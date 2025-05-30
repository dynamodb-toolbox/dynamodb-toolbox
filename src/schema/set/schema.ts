import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SchemaProps } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import { hasDefinedDefault } from '../utils/hasDefinedDefault.js'
import type { SetElementSchema } from './types.js'

export class SetSchema<
  ELEMENTS extends SetElementSchema = SetElementSchema,
  PROPS extends SchemaProps = SchemaProps
> {
  type: 'set'
  elements: ELEMENTS
  props: PROPS

  constructor(elements: ELEMENTS, props: PROPS) {
    this.type = 'set'
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

    const { required, hidden, savedAs } = this.elements.props

    if (required !== undefined && required !== 'atLeastOnce') {
      throw new DynamoDBToolboxError('schema.set.optionalElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.set.hiddenElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.set.savedAsElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot be renamed (have savedAs prop).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.set.defaultedElements', {
        message: `Invalid set elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Set elements cannot have default or linked values.`,
        path
      })
    }

    this.elements.check(`${path ?? ''}[x]`)

    Object.freeze(this.props)
    Object.freeze(this.elements)
  }
}
