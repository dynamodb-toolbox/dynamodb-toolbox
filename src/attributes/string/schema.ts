import { checkPrimitiveAttribute } from '../primitive/check.js'
import type { StringAttributeState } from './types.js'

export class StringSchema<STATE extends StringAttributeState = StringAttributeState> {
  type: 'string'
  path?: string
  state: STATE

  constructor(state: STATE) {
    this.type = 'string'
    this.state = state
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkPrimitiveAttribute(this, path)

    Object.freeze(this.state)
    if (path !== undefined) {
      this.path = path
    }
  }
}
