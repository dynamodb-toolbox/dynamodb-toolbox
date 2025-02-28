import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import type { AnySchemaProps } from './types.js'

export class AnySchema<PROPS extends AnySchemaProps = AnySchemaProps> {
  type: 'any'
  props: PROPS

  constructor(props: PROPS) {
    this.type = 'any'
    this.props = props
  }

  get checked(): boolean {
    return Object.isFrozen(this.props)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkSchemaProps(this.props, path)

    Object.freeze(this.props)
  }
}
