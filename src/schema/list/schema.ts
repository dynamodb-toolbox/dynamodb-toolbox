import { DynamoDBToolboxError } from '~/errors/index.js'

import type { Schema, SchemaProps } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import { hasDefinedDefault } from '../utils/hasDefinedDefault.js'

/**
 * Schema for a list attribute.
 */
export class ListSchema<ELEMENTS extends Schema = Schema, PROPS extends SchemaProps = SchemaProps> {
  type: 'list'
  elements: ELEMENTS
  props: PROPS

  /**
   * Instantiate the schema from its elements and props.
   */
  constructor(elements: ELEMENTS, props: PROPS) {
    this.type = 'list'
    this.elements = elements
    this.props = props
  }

  /**
   * Whether the schema's props have been validated and frozen.
   */
  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  /**
   * Validate the schema's props and elements, then freeze them.
   */
  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    const { required, hidden, savedAs } = this.elements.props

    if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
      throw new DynamoDBToolboxError('schema.list.optionalElements', {
        message: `Invalid list elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements must be required.`,
        path
      })
    }

    if (hidden !== undefined && hidden !== false) {
      throw new DynamoDBToolboxError('schema.list.hiddenElements', {
        message: `Invalid list elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements cannot be hidden.`,
        path
      })
    }

    if (savedAs !== undefined) {
      throw new DynamoDBToolboxError('schema.list.savedAsElements', {
        message: `Invalid list elements at path ${
          path !== undefined ? ` at path '${path}'` : ''
        }: List elements cannot be renamed (have savedAs prop).`,
        path
      })
    }

    if (hasDefinedDefault(this.elements)) {
      throw new DynamoDBToolboxError('schema.list.defaultedElements', {
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
