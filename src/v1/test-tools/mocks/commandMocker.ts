import { isString } from 'v1/utils/validation/isString'

import type { CommandName } from './types'
import { $commandName, $mockedEntity, $mockedImplementations } from './constants'

// NOTE: Those types come from @aws-sdk
interface Error {
  name: string
  message: string
  stack?: string
}

interface MetadataBearer {
  $metadata: {
    httpStatusCode?: number
    requestId?: string
    extendedRequestId?: string
    cfId?: string
    attempts?: number
    totalRetryDelay?: number
  }
}

interface AwsError
  extends Partial<{ name: string; message: string; stack?: string }>,
    Partial<MetadataBearer> {
  Type?: string
  Code?: string
  $fault?: 'client' | 'server'
  $service?: string
}

export class CommandMocker<COMMAND_TYPE extends CommandName, INPUT, OPTIONS, RESPONSE> {
  [$commandName]: COMMAND_TYPE;
  [$mockedEntity]: {
    [$mockedImplementations]: Partial<
      Record<COMMAND_TYPE, (input: INPUT, options?: OPTIONS) => RESPONSE>
    >
  }

  resolve: (response: RESPONSE) => CommandMocker<COMMAND_TYPE, INPUT, OPTIONS, RESPONSE>
  reject: (
    error?: string | Error | AwsError
  ) => CommandMocker<COMMAND_TYPE, INPUT, OPTIONS, RESPONSE>
  mockImplementation: (
    implementation: (key: INPUT, options?: OPTIONS) => RESPONSE
  ) => CommandMocker<COMMAND_TYPE, INPUT, OPTIONS, RESPONSE>

  constructor(
    commandName: COMMAND_TYPE,
    mockedEntity: {
      [$mockedImplementations]: Partial<
        Record<COMMAND_TYPE, (input: INPUT, options?: OPTIONS) => RESPONSE>
      >
    }
  ) {
    this[$commandName] = commandName
    this[$mockedEntity] = mockedEntity

    this.resolve = response => {
      this[$mockedEntity][$mockedImplementations][this[$commandName]] = () => response
      return this
    }

    this.reject = error => {
      this[$mockedEntity][$mockedImplementations][this[$commandName]] = () => {
        if (error === undefined || isString(error)) {
          throw new Error(error)
        } else {
          throw error
        }
      }

      return this
    }

    this.mockImplementation = implementation => {
      this[$mockedEntity][$mockedImplementations][this[$commandName]] = implementation

      return this
    }
  }
}
