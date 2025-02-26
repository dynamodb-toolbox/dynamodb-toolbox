import { checkPrimitiveAttribute } from '../primitive/check.js'
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

    checkPrimitiveAttribute(this, path)
    // TODO: Validate that big is a boolean

    Object.freeze(this.props)
  }
}
