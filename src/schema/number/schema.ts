import { DynamoDBToolboxError } from '~/errors/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import { checkPrimitiveSchema } from '../primitive/check.js'
import type { NumberSchemaProps } from './types.js'

/**
 * Schema for a number attribute.
 */
export class NumberSchema<PROPS extends NumberSchemaProps = NumberSchemaProps> {
  type: 'number'
  props: PROPS

  /**
   * Instantiate the schema from its props.
   */
  constructor(props: PROPS) {
    this.type = 'number'
    this.props = props
  }

  /**
   * Whether the schema's props have been validated and frozen.
   */
  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  /**
   * Validate the schema's props and freeze them.
   */
  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkPrimitiveSchema(this, path)

    const { big } = this.props

    if (big !== undefined && !isBoolean(big)) {
      throw new DynamoDBToolboxError('schema.invalidProp', {
        message: `Invalid property type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Property: 'big'. Expected: boolean. Received: ${String(big)}.`,
        path,
        payload: { propName: 'big', received: big }
      })
    }

    Object.freeze(this.props)
  }
}
