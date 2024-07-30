import type { $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { isString } from '~/utils/validation/isString.js'

import { $actionName, $mocks, $spy } from './constants.js'
import type { EntitySpy } from './spy.js'

// NOTE: Those types come from @aws-sdk but I couldn't import them
export interface Error {
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

export interface AwsError
  extends Partial<{ name: string; message: string; stack?: string }>,
    Partial<MetadataBearer> {
  Type?: string
  Code?: string
  $fault?: 'client' | 'server'
  $service?: string
}

export class EntityActionStub<ENTITY extends Entity, ACTION extends EntitySendableAction<ENTITY>> {
  [$spy]: EntitySpy<ENTITY>;
  [$actionName]: string

  constructor(spy: EntitySpy<ENTITY>, Action: new (entity: ENTITY) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  resolve(response: Awaited<ReturnType<ACTION['send']>>): EntitySpy<ENTITY> {
    this[$spy][$mocks][this[$actionName]] = () => response

    return this[$spy]
  }

  reject(error?: string | Error | AwsError): EntitySpy<ENTITY> {
    this[$spy][$mocks][this[$actionName]] = () => {
      if (error === undefined || isString(error)) {
        throw new Error(error)
      } else {
        throw error
      }
    }

    return this[$spy]
  }

  mock(
    mock: (
      ...args: ReturnType<ACTION[$sentArgs]>
    ) => ReturnType<ACTION['send']> | Awaited<ReturnType<ACTION['send']>> | undefined
  ): EntitySpy<ENTITY> {
    this[$spy][$mocks][this[$actionName]] = mock

    return this[$spy]
  }
}
