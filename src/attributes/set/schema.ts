import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkSchemaProps } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SchemaProps } from '../shared/props.js'
import type { SetElementSchema } from './types.js'

export class SetSchema<
  PROPS extends SchemaProps = SchemaProps,
  ELEMENTS extends SetElementSchema = SetElementSchema
> {
  type: 'set'
  elements: ELEMENTS
  props: PROPS

  constructor(props: PROPS, elements: ELEMENTS) {
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

    Object.freeze(this.props)
    Object.freeze(this.elements)
  }
}
