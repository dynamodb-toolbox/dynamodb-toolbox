import type { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import type { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import { $accessPatterns, $entities } from '~/table/constants.js'
import type { Table } from '~/table/index.js'
import { Table_ } from '~/table/index.js'

import { DB as DBEntity } from '../dbEntity.js'

export type DBTableEntities<TABLE extends Table | Table_ = Table | Table_> = TABLE extends Table_
  ? { [ENTITY in TABLE[$entities][number] as ENTITY['entityName']]: DBEntity<ENTITY> }
  : {}

export const dbTableEntities = <TABLE extends Table | Table_>(
  table: TABLE
): DBTableEntities<TABLE> =>
  (table instanceof Table_
    ? Object.fromEntries(
        table[$entities].map((entity: Entity) => [entity.entityName, new DBEntity(entity)])
      )
    : {}) as DBTableEntities<TABLE>

export type DBTableAccessPatterns<TABLE extends Table | Table_ = Table | Table_> =
  TABLE extends Table_ ? TABLE[$accessPatterns] : {}

export const dbTableAccessPatterns = <TABLE extends Table | Table_>(
  table: TABLE
): DBTableAccessPatterns<TABLE> =>
  (table instanceof Table_ ? table[$accessPatterns] : {}) as DBTableAccessPatterns<TABLE>

export type DBTableQuery<TABLE extends Table | Table_ = Table | Table_> = TABLE extends Table_
  ? { [KEY in keyof TABLE[$accessPatterns]]: TABLE[$accessPatterns][KEY]['query'] }
  : {}

export const dbTableQuery = <TABLE extends Table | Table_>(table: TABLE): DBTableQuery<TABLE> =>
  (table instanceof Table_
    ? Object.fromEntries(
        Object.entries(table[$accessPatterns]).map(([key, ap]) => [
          key,
          input => (ap as ITableAccessPattern | IEntityAccessPattern).query(input)
        ])
      )
    : {}) as DBTableQuery<TABLE>
