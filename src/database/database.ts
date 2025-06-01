import { Registry } from '~/table/actions/registry/registry.js'
import { Table } from '~/table/index.js'

import type { DatabaseMetadata } from './types.js'

export class Database<
  TABLES extends Record<string, Table | Registry> = Record<string, Table | Registry>
> {
  readonly tables: Register<TABLES>
  public meta: DatabaseMetadata

  constructor(tables: TABLES, { meta = {} }: { meta?: DatabaseMetadata } = {}) {
    this.tables = register(tables)
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

type Register<TABLES extends Record<string, Table | Registry>> = {
  [KEY in keyof TABLES]: RegisterTable<TABLES[KEY]>
}

type RegisterTable<TABLE extends Table | Registry> = TABLE extends Table ? Registry<TABLE> : TABLE

const register = <TABLES extends Record<string, Table | Registry>>(
  tables: TABLES
): Register<TABLES> =>
  Object.fromEntries(
    Object.entries(tables).map(([key, table]) => [
      key,
      table instanceof Table ? table.build(Registry) : table
    ])
  ) as Register<TABLES>
