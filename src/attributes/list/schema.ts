import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkSchemaProps } from '../shared/check.js'
import { hasDefinedDefault } from '../shared/hasDefinedDefault.js'
import type { SchemaProps } from '../shared/props.js'
import type { AttrSchema } from '../types/index.js'

export class ListSchema<
  PROPS extends SchemaProps = SchemaProps,
  ELEMENTS extends AttrSchema = AttrSchema
> {
  type: 'list'
  elements: ELEMENTS
  props: PROPS

  constructor(props: PROPS, elements: ELEMENTS) {
    this.type = 'list'
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

    if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
      throw new DynamoDBToolboxError('schema.listAttribute.optionalElements', {
        message: `Invalid list elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.listAttribute.hiddenElements', {
        message: `Invalid list elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.listAttribute.savedAsElements', {
        message: `Invalid list elements at path ${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements cannot be renamed (have savedAs option).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.listAttribute.defaultedElements', {
        message: `Invalid list elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements cannot have default or linked values.`,
        path
      })
    }

    this.elements.check(`${path ?? ''}[n]`)

    Object.freeze(this.props)
    Object.freeze(this.elements)
  }
}
