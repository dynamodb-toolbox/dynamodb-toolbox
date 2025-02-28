import { checkPrimitiveSchema } from '../primitive/check.js'
import type { NullSchemaProps } from './types.js'

export class NullSchema<PROPS extends NullSchemaProps = NullSchemaProps> {
  type: 'null'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'null'
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
