import { checkPrimitiveSchema } from '../primitive/check.js'
import type { StringSchemaProps } from './types.js'

export class StringSchema<PROPS extends StringSchemaProps = StringSchemaProps> {
  type: 'string'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'string'
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
