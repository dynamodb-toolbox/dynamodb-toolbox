import { checkPrimitiveSchema } from '../primitive/check.js'
import type { BinarySchemaProps } from './types.js'

export class BinarySchema<PROPS extends BinarySchemaProps = BinarySchemaProps> {
  type: 'binary'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'binary'
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
