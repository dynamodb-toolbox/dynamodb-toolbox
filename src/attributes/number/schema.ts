import { DynamoDBToolboxError } from '~/errors/index.js'
import { isBoolean } from '~/utils/validation/isBoolean.js'

import { checkPrimitiveSchema } from '../primitive/check.js'
import type { NumberSchemaProps } from './types.js'

export class NumberSchema<PROPS extends NumberSchemaProps = NumberSchemaProps> {
  type: 'number'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'number'
    this.props = props
  }

  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkPrimitiveSchema(this, path)

    const { big } = this.props

    if (big !== undefined && !isBoolean(big)) {
      throw new DynamoDBToolboxError('schema.attribute.invalidProperty', {
        message: `Invalid option value type${
          path !== undefined ? ` at path '${path}'` : ''
        }. Property: 'big'. Expected: boolean. Received: ${String(big)}.`,
        path,
        payload: {
          propertyName: 'big',
          received: big
        }
      })
    }

    Object.freeze(this.props)
  }
}
