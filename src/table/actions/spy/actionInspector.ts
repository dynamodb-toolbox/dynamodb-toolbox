import type { $sentArgs } from '~/table/constants.js'
import type { Table, TableSendableAction } from '~/table/table.js'
import { isInteger } from '~/utils/validation/isInteger.js'

import { $actionName, $spy } from './/constants.js'
import { $sentActions } from './constants.js'
import type { TableSpy } from './spy.js'

export class TableActionInspector<TABLE extends Table, ACTION extends TableSendableAction<TABLE>> {
  [$spy]: TableSpy<TABLE>;
  [$actionName]: string

  constructor(spy: TableSpy<TABLE>, Action: new (entity: TABLE) => ACTION) {
    this[$spy] = spy
    this[$actionName] = (Action as unknown as { actionName: string }).actionName
  }

  count(): number {
    return this[$spy][$sentActions][this[$actionName]]?.length ?? 0
  }

  args(at: number): ReturnType<ACTION[$sentArgs]> | undefined {
    if (!isInteger(at)) {
      throw new Error('Please provide an integer when searching for received command arguments')
    }

    return this[$spy][$sentActions][this[$actionName]]?.[at]
  }

  allArgs(): ReturnType<ACTION[$sentArgs]>[] {
    return this[$spy][$sentActions][this[$actionName]] ?? []
  }
}
