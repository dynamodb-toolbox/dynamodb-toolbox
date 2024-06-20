import { isString } from '~/utils/validation/isString.js'

import type { ActionName } from './types.js'
import { $actionName, $mockedEntity, $mockedImplementations } from './constants.js'

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

export class ActionMocker<ACTION_NAME extends ActionName, INPUT, OPTIONS, RESPONSE> {
  [$actionName]: ACTION_NAME;
  [$mockedEntity]: {
    [$mockedImplementations]: Partial<
      Record<ACTION_NAME, (input: INPUT, options?: OPTIONS) => RESPONSE>
    >
  }

  constructor(
    actionName: ACTION_NAME,
    mockedEntity: {
      [$mockedImplementations]: Partial<
        Record<ACTION_NAME, (input: INPUT, options?: OPTIONS) => RESPONSE>
      >
    }
  ) {
    this[$actionName] = actionName
    this[$mockedEntity] = mockedEntity
  }

  resolve(response: RESPONSE): ActionMocker<ACTION_NAME, INPUT, OPTIONS, RESPONSE> {
    this[$mockedEntity][$mockedImplementations][this[$actionName]] = () => response
    return this
  }

  reject(error?: string | Error | AwsError): ActionMocker<ACTION_NAME, INPUT, OPTIONS, RESPONSE> {
    this[$mockedEntity][$mockedImplementations][this[$actionName]] = () => {
      if (error === undefined || isString(error)) {
        throw new Error(error)
      } else {
        throw error
      }
    }

    return this
  }

  mockImplementation(
    implementation: (key: INPUT, options?: OPTIONS) => RESPONSE
  ): ActionMocker<ACTION_NAME, INPUT, OPTIONS, RESPONSE> {
    this[$mockedEntity][$mockedImplementations][this[$actionName]] = implementation

    return this
  }
}
