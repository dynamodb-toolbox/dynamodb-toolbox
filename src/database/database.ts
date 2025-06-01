import type { Registry } from '~/table/actions/registry/registry.js'

import type { DatabaseMetadata } from './types.js'

export class Database<TABLES extends Record<string, Registry> = Record<string, Registry>> {
  readonly tables: TABLES
  public meta: DatabaseMetadata

  constructor(tables: TABLES, { meta = {} }: { meta?: DatabaseMetadata } = {}) {
    this.tables = tables
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
