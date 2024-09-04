import { $interceptor, $sentArgs } from '~/table/constants.js'
import { TableAction } from '~/table/index.js'
import type { Table, TableSendableAction } from '~/table/table.js'

import { TableActionInspector } from './actionInspector.js'
import { TableActionStub } from './actionStub.js'
import { $mocks, $sentActions } from './constants.js'

export class TableSpy<TABLE extends Table = Table> extends TableAction<TABLE> {
  static override actionName: 'spy';

  [$mocks]: Record<string, (...args: any[]) => any>;
  [$sentActions]: Record<string, any[]>

  constructor(table: TABLE) {
    super(table)

    this[$mocks] = {}
    this[$sentActions] = {}

    table[$interceptor] = (action: TableSendableAction) => {
      const actionName = (action.constructor as unknown as { actionName: string }).actionName

      const sentArgs = action[$sentArgs]()

      if (this[$sentActions][actionName] !== undefined) {
        this[$sentActions][actionName].push(sentArgs)
      } else {
        this[$sentActions][actionName] = [sentArgs]
      }

      if (this[$mocks][actionName] !== undefined) {
        return this[$mocks][actionName](...sentArgs)
      }
    }
  }

  reset(): TableSpy<TABLE> {
    this[$mocks] = {}
    this[$sentActions] = {}

    return this
  }

  on<ACTION extends TableSendableAction<TABLE> = TableSendableAction<TABLE>>(
    Action: new (table: TABLE) => ACTION
  ): TableActionStub<TABLE, ACTION> {
    return new TableActionStub(this, Action)
  }

  sent<ACTION extends TableSendableAction<TABLE> = TableSendableAction<TABLE>>(
    Action: new (entity: TABLE) => ACTION
  ): TableActionInspector<TABLE, ACTION> {
    return new TableActionInspector(this, Action)
  }

  restore(): void {
    delete this.table[$interceptor]
  }
}
