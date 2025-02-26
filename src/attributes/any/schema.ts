import { checkAttributeProperties } from '../shared/check.js'
import type { AnyAttributeState } from './types.js'

export class AnySchema<STATE extends AnyAttributeState = AnyAttributeState> {
  type: 'any'
  state: STATE

  constructor(state: STATE) {
    this.type = 'any'
    this.state = state
  }

  get checked(): boolean {
    return Object.isFrozen(this.state)
  }

  check(path?: string): void {
    if (this.checked) {
      return
    }

    checkAttributeProperties(this.state, path)

    Object.freeze(this.state)
  }
}
