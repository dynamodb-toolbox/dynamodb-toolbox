import { checkPrimitiveSchema } from '../primitive/check.js'
import type { BooleanSchemaProps } from './types.js'

/**
 * Schema for a boolean attribute.
 */
export class BooleanSchema<PROPS extends BooleanSchemaProps = BooleanSchemaProps> {
  type: 'boolean'
  props: PROPS

  /**
   * Instantiate the schema from its props.
   */
  constructor(props: PROPS) {
    this.type = 'boolean'
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
