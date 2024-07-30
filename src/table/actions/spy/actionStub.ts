import type { $sentArgs } from '~/table/constants.js'
import type { Table, TableSendableAction } from '~/table/table.js'
import { isString } from '~/utils/validation/isString.js'

import { $actionName, $mocks, $spy } from './constants.js'
import type { TableSpy } from './spy.js'

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

export class TableActionStub<TABLE extends Table, ACTION extends TableSendableAction<TABLE>> {
  [$spy]: TableSpy<TABLE>;
  [$actionName]: string

  constructor(spy: TableSpy<TABLE>, Action: new (entity: TABLE) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  resolve(response: Awaited<ReturnType<ACTION['send']>>): TableSpy<TABLE> {
    this[$spy][$mocks][this[$actionName]] = () => response

    return this[$spy]
  }

  reject(error?: string | Error | AwsError): TableSpy<TABLE> {
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
    ) => ReturnType<ACTION['send']> | Awaited<ReturnType<ACTION['send']>>
  ): TableSpy<TABLE> {
    this[$spy][$mocks][this[$actionName]] = mock

    return this[$spy]
  }
}
