import type { Table } from '~/table/index.js'
import type { Table_ } from '~/table/index.js'

import type { DatabaseMetadata } from './types.js'
import { DB as DBTable } from './utils/dbTable/index.js'

export class Database<
  TABLES extends Record<string, Table | Table_> = Record<string, Table | Table_>
> {
  readonly tables: {
    [KEY in keyof TABLES]: DBTable<TABLES[KEY]>
  }
  public meta: DatabaseMetadata

  constructor(tables: TABLES, { meta = {} }: { meta?: DatabaseMetadata } = {}) {
    this.tables = Object.fromEntries(
      Object.entries(tables).map(([key, table]) => [key, new DBTable(table)])
    ) as { [KEY in keyof TABLES]: DBTable<TABLES[KEY]> }
    this.meta = meta
  }

  build<ACTION extends DatabaseAction<this> = DatabaseAction<this>>(
    Action: new (table: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}

export class DatabaseAction<DATABASE extends Database = Database> {
  static actionName: string

  constructor(readonly database: DATABASE) {}
}
