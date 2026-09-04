import { checkPrimitiveSchema } from '../primitive/check.js'
import type { NullSchemaProps } from './types.js'

/**
 * Schema for a null attribute.
 */
export class NullSchema<PROPS extends NullSchemaProps = NullSchemaProps> {
  type: 'null'
  props: PROPS

  /**
   * Instantiate the schema from its props.
   */
  constructor(props: PROPS) {
    this.type = 'null'
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
