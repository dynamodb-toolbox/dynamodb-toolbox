import { checkPrimitiveAttribute } from '../primitive/check.js'
import type { NullAttributeState } from './types.js'

export class NullSchema<STATE extends NullAttributeState = NullAttributeState> {
  type: 'null'
  path?: string
  state: STATE

  constructor(state: STATE) {
    this.type = 'null'
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
