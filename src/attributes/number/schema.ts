import { checkPrimitiveAttribute } from '../primitive/check.js'
import type { NumberAttributeState } from './types.js'

export class NumberSchema<STATE extends NumberAttributeState = NumberAttributeState> {
  type: 'number'
  state: STATE

  constructor(state: STATE) {
    this.type = 'number'
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
    // TODO: Validate that big is a boolean

    Object.freeze(this.state)
  }
}
