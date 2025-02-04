import { TableAction } from '~/table/index.js'
import type { Table } from '~/table/table.js'
import type { IndexableKeyType } from '~/table/types/keyType.js'

export interface ITableDTO {
  tableName?: string | undefined
  partitionKey: {
    type: IndexableKeyType
    name: string
  }
  sortKey?: {
    type: 'string' | 'number' | 'binary'
    name: string
  }
  entityAttributeSavedAs?: string
}

export class TableDTO<TABLE extends Table = Table> extends TableAction<TABLE> implements ITableDTO {
  static override actionName = 'dto' as const
  tableName?: string
  partitionKey: ITableDTO['partitionKey']
  sortKey?: ITableDTO['sortKey']
  entityAttributeSavedAs: string

  constructor(table: TABLE) {
    super(table)
    this.tableName = this.table.name !== undefined ? this.table.getName() : undefined
    this.partitionKey = this.table.partitionKey
    this.sortKey = this.table.sortKey
    this.partitionKey = this.table.partitionKey
    this.entityAttributeSavedAs = this.table.entityAttributeSavedAs
  }

  toJSON(): ITableDTO {
    return {
      ...(this.tableName !== undefined ? { tableName: this.tableName } : {}),
      partitionKey: this.partitionKey,
      ...(this.sortKey !== undefined ? { sortKey: this.sortKey } : {}),
      entityAttributeSavedAs: this.entityAttributeSavedAs
    }
  }
}
