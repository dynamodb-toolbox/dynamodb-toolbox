import type { Table } from '~/table/index.js'
import type { Table_ } from '~/table/index.js'

import { DB as DBTable } from './utils/dbTable/index.js'

export class Database<
  TABLES extends Record<string, Table | Table_> = Record<string, Table | Table_>
> {
  public tables: {
    [KEY in keyof TABLES]: DBTable<TABLES[KEY]>
  }

  constructor(tables = {} as TABLES) {
    this.tables = Object.fromEntries(
      Object.entries(tables).map(([key, table]) => [key, new DBTable(table)])
    ) as { [KEY in keyof TABLES]: DBTable<TABLES[KEY]> }
  }

  build<ACTION extends DatabaseAction<this> = DatabaseAction<this>>(
    Action: new (table: this) => ACTION
  ): ACTION {
    return new Action(this)
  }
}

export class DatabaseAction<DATABASE extends Database = Database> {
  static actionName: string

  constructor(public database: DATABASE) {}
}
