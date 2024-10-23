import { TableAction } from '~/table/index.js'
import type { Table } from '~/table/table.js'

import type { JSONizedTable } from './schema.js'

export class TableJSONizer<TABLE extends Table = Table> extends TableAction<TABLE> {
  static override actionName = 'jsonize' as const

  jsonize(): JSONizedTable {
    return {
      type: 'table',
      ...(this.table.name !== undefined ? { name: this.table.getName() } : {}),
      partitionKey: this.table.partitionKey,
      ...(this.table.sortKey !== undefined ? { sortKey: this.table.sortKey } : {}),
      entityAttributeSavedAs: this.table.entityAttributeSavedAs
    }
  }
}
