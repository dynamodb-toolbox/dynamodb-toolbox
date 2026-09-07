import { $interceptor, $sentArgs } from '~/table/constants.js'
import { TableAction } from '~/table/index.js'
import type { Table, TableSendableAction } from '~/table/table.js'

import { TableActionInspector } from './actionInspector.js'
import { TableActionStub } from './actionStub.js'
import { $mocks, $sentActions } from './constants.js'

/** Intercept a table's sendable actions to stub responses and record calls in tests. */
export class TableSpy<TABLE extends Table = Table> extends TableAction<TABLE> {
  static override actionName: 'spy';

  [$mocks]: Record<string, (...args: any[]) => any>;
  [$sentActions]: Record<string, any[]>

  /** Bind the spy to a table and install its action interceptor. */
  constructor(table: TABLE) {
    super(table)

    this[$mocks] = {}
    this[$sentActions] = {}

    table[$interceptor] = (action: TableSendableAction) => {
      const actionName = (action.constructor as unknown as { actionName: string }).actionName

      const sentArgs = action[$sentArgs]()

      const actionSentArgs = this[$sentActions][actionName]
      if (actionSentArgs !== undefined) {
        actionSentArgs.push(sentArgs)
      } else {
        this[$sentActions][actionName] = [sentArgs]
      }

      const actionMock = this[$mocks][actionName]
      if (actionMock !== undefined) {
        return actionMock(...sentArgs)
      }
    }
  }

  /** Clear all mocks and recorded actions. */
  reset(): TableSpy<TABLE> {
    this[$mocks] = {}
    this[$sentActions] = {}

    return this
  }

  /** Stub a given action's `send` with a canned response. */
  on<ACTION extends TableSendableAction<TABLE> = TableSendableAction<TABLE>>(
    Action: new (table: TABLE) => ACTION
  ): TableActionStub<TABLE, ACTION> {
    return new TableActionStub(this, Action)
  }

  /** Inspect the recorded calls for a given action. */
  sent<ACTION extends TableSendableAction<TABLE> = TableSendableAction<TABLE>>(
    Action: new (entity: TABLE) => ACTION
  ): TableActionInspector<TABLE, ACTION> {
    return new TableActionInspector(this, Action)
  }

  /** Remove the interceptor, restoring the table's normal behavior. */
  restore(): void {
    delete this.table[$interceptor]
  }
}
