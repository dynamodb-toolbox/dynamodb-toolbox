import { checkPrimitiveAttribute } from '../primitive/check.js'
import type { BooleanAttributeState } from './types.js'

export class BooleanSchema<STATE extends BooleanAttributeState = BooleanAttributeState> {
  type: 'boolean'
  path?: string
  state: STATE

  constructor(state: STATE) {
    this.type = 'boolean'
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
