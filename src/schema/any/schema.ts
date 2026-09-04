import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import type { AnySchemaProps } from './types.js'

/**
 * Schema for an attribute of any type.
 */
export class AnySchema<PROPS extends AnySchemaProps = AnySchemaProps> {
  type: 'any'
  props: PROPS

  /**
   * Instantiate the schema from its props.
   */
  constructor(props: PROPS) {
    this.type = 'any'
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

    checkSchemaProps(this.props, path)

    Object.freeze(this.props)
  }
}
