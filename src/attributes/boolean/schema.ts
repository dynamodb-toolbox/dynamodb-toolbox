import { checkPrimitiveSchema } from '../primitive/check.js'
import type { BooleanSchemaProps } from './types.js'

export class BooleanSchema<PROPS extends BooleanSchemaProps = BooleanSchemaProps> {
  type: 'boolean'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'boolean'
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

    Object.freeze(this.props)
  }
}
