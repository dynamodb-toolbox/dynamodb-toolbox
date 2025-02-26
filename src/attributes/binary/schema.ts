import { checkPrimitiveAttribute } from '../primitive/check.js'
import type { BinaryAttributeState } from './types.js'

export class BinarySchema<STATE extends BinaryAttributeState = BinaryAttributeState> {
  type: 'binary'
  state: STATE

  constructor(state: STATE) {
    this.type = 'binary'
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
  }
}
