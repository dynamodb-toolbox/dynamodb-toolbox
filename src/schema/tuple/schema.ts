import { DynamoDBToolboxError } from '~/errors/index.js'
import { isArray } from '~/utils/validation/isArray.js'

import type { SchemaProps } from '../types/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import type { TupleElementSchema } from './types.js'

export class TupleSchema<
  ELEMENTS extends TupleElementSchema[] = TupleElementSchema[],
  PROPS extends SchemaProps = SchemaProps
> {
  type: 'tuple'
  elements: ELEMENTS
  props: PROPS

  constructor(elements: ELEMENTS, props: PROPS) {
    this.type = 'tuple'
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
      throw new DynamoDBToolboxError('schema.tuple.invalidElements', {
        message: `Invalid tuple elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Tuple elements must be an array.`,
        path
      })
    }

    if (this.elements.length === 0) {
      throw new DynamoDBToolboxError('schema.tuple.missingElements', {
        message: `Invalid tuple elements${
          path !== undefined ? ` at path '${path}'` : ''
        }: Tuple elements must have at least one element.`,
        path
      })
    }

    for (const element of this.elements) {
      const { required, hidden, savedAs } = element.props

      if (required !== undefined && required !== 'atLeastOnce' && required !== 'always') {
        throw new DynamoDBToolboxError('schema.tuple.optionalElements', {
          message: `Invalid tuple elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: Tuple elements must be required.`,
          path
        })
      }

      if (hidden !== undefined && hidden !== false) {
        throw new DynamoDBToolboxError('schema.tuple.hiddenElements', {
          message: `Invalid tuple elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: Tuple elements cannot be hidden.`,
          path
        })
      }

      if (savedAs !== undefined) {
        throw new DynamoDBToolboxError('schema.tuple.savedAsElements', {
          message: `Invalid tuple elements${
            path !== undefined ? ` at path '${path}'` : ''
          }: Tuple elements cannot be renamed (have savedAs prop).`,
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
