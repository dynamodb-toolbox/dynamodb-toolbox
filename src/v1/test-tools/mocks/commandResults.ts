import type { CommandType } from './types'
import { $commandType, $mockedEntity, $receivedCommands } from './constants'
import { isInteger } from 'v1/utils/validation'

export class CommandResults<COMMAND_TYPE extends CommandType, INPUT, OPTIONS> {
  [$commandType]: COMMAND_TYPE;
  [$mockedEntity]: {
    [$receivedCommands]: Record<COMMAND_TYPE, [input?: INPUT, options?: OPTIONS][]>
  }

  count: () => number
  args: (at: number) => [input?: INPUT, options?: OPTIONS] | undefined
  allArgs: () => [input?: INPUT, options?: OPTIONS][]

  constructor(
    commandType: COMMAND_TYPE,
    mockedEntity: {
      [$receivedCommands]: Record<COMMAND_TYPE, [input?: INPUT, options?: OPTIONS][]>
    }
  ) {
    this[$commandType] = commandType
    this[$mockedEntity] = mockedEntity

    this.count = () => this[$mockedEntity][$receivedCommands][this[$commandType]].length

    this.args = (at: number) => {
      if (!isInteger(at)) {
        throw new Error('Please provide an integer when searching for received command arguments')
      }

      return this[$mockedEntity][$receivedCommands][this[$commandType]][at]
    }

    this.allArgs = () => this[$mockedEntity][$receivedCommands][this[$commandType]]
  }
}
