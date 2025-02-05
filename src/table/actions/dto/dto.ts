import type { Index, Key } from '~/table/index.js'
import { TableAction } from '~/table/index.js'
import type { Table } from '~/table/table.js'

export interface ITableDTO {
  tableName?: string | undefined
  partitionKey: Key
  sortKey?: Key
  indexes?: Record<string, Index>
  entityAttributeSavedAs?: string
}

export class TableDTO<TABLE extends Table = Table> extends TableAction<TABLE> implements ITableDTO {
  static override actionName = 'dto' as const
  tableName?: string
  partitionKey: ITableDTO['partitionKey']
  sortKey?: ITableDTO['sortKey']
  indexes?: ITableDTO['indexes']
  entityAttributeSavedAs: string

  constructor(table: TABLE) {
    super(table)
    this.tableName = this.table.name !== undefined ? this.table.getName() : undefined
    this.partitionKey = this.table.partitionKey
    this.sortKey = this.table.sortKey
    this.indexes = this.table.indexes
    this.entityAttributeSavedAs = this.table.entityAttributeSavedAs
  }

  toJSON(): ITableDTO {
    return {
      ...(this.tableName !== undefined ? { tableName: this.tableName } : {}),
      partitionKey: this.partitionKey,
      ...(this.sortKey !== undefined ? { sortKey: this.sortKey } : {}),
      ...(this.indexes !== undefined && Object.entries(this.indexes).length > 0
        ? { indexes: this.indexes }
        : {}),
      entityAttributeSavedAs: this.entityAttributeSavedAs
    }
  }
}
