import { checkPrimitiveSchema } from '../primitive/check.js'
import type { BinarySchemaProps } from './types.js'

/**
 * Schema for a binary attribute.
 */
export class BinarySchema<PROPS extends BinarySchemaProps = BinarySchemaProps> {
  type: 'binary'
  props: PROPS

  /**
   * Instantiate the schema from its props.
   */
  constructor(props: PROPS) {
    this.type = 'binary'
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

    Object.freeze(this.props)
  }
}
