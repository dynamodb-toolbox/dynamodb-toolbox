import { isInteger } from 'v1/utils/validation'

import { $receivedCommands } from './constants'

export class CommandResults<INPUT, OPTIONS> {
  [$receivedCommands]: [input?: INPUT, options?: OPTIONS][]

  constructor(receivedCommands: [input?: INPUT, options?: OPTIONS][]) {
    this[$receivedCommands] = receivedCommands
  }

  count(): number {
    return this[$receivedCommands].length
  }

  args(at: number): [input?: INPUT, options?: OPTIONS] | undefined {
    if (!isInteger(at)) {
      throw new Error('Please provide an integer when searching for received command arguments')
    }

    return this[$receivedCommands][at]
  }

  allArgs(): [input?: INPUT, options?: OPTIONS][] {
    return this[$receivedCommands]
  }
}
