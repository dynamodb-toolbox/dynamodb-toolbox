import { isInteger } from 'v1/utils/validation'

import { $receivedCommands } from './constants'

export class CommandResults<INPUT, OPTIONS> {
  [$receivedCommands]: [input?: INPUT, options?: OPTIONS][]

  count: () => number
  args: (at: number) => [input?: INPUT, options?: OPTIONS] | undefined
  allArgs: () => [input?: INPUT, options?: OPTIONS][]

  constructor(receivedCommands: [input?: INPUT, options?: OPTIONS][]) {
    this[$receivedCommands] = receivedCommands

    this.count = () => this[$receivedCommands].length

    this.args = (at: number) => {
      if (!isInteger(at)) {
        throw new Error('Please provide an integer when searching for received command arguments')
      }

      return this[$receivedCommands][at]
    }

    this.allArgs = () => this[$receivedCommands]
  }
}
