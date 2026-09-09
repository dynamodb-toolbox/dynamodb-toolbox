import type { $sentArgs } from '~/entity/constants.js'
import type { Entity, EntitySendableAction } from '~/entity/entity.js'
import { isString } from '~/utils/validation/isString.js'

import { $actionName, $mocks, $spy } from './constants.js'
import type { EntitySpy } from './spy.js'

// NOTE: Those types come from @aws-sdk but I couldn't import them
/** Minimal `Error` shape used to reject a stubbed action. */
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

/** AWS SDK error shape used to reject a stubbed action. */
export interface AwsError
  extends Partial<{ name: string; message: string; stack?: string }>,
    Partial<MetadataBearer> {
  Type?: string
  Code?: string
  $fault?: 'client' | 'server'
  $service?: string
}

/** Stub an entity action's `send` with a canned response, error or mock. */
export class EntityActionStub<ENTITY extends Entity, ACTION extends EntitySendableAction<ENTITY>> {
  [$spy]: EntitySpy<ENTITY>;
  [$actionName]: string

  /** Bind the stub to a spy and the action to intercept. */
  constructor(spy: EntitySpy<ENTITY>, Action: new (entity: ENTITY) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  /** Make the action resolve with the given response. */
  resolve(response: Awaited<ReturnType<ACTION['send']>>): EntitySpy<ENTITY> {
    this[$spy][$mocks][this[$actionName]] = () => response

    return this[$spy]
  }

  /** Make the action reject with the given error. */
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

  /** Replace the action's `send` with a custom implementation over its sent args. */
  mock(
    mock: (
      ...args: ReturnType<ACTION[$sentArgs]>
    ) => ReturnType<ACTION['send']> | Awaited<ReturnType<ACTION['send']>> | undefined
  ): EntitySpy<ENTITY> {
    this[$spy][$mocks][this[$actionName]] = mock

    return this[$spy]
  }
}
