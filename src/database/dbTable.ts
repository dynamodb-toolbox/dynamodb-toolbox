import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import type { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import { $accessPatterns, $entities } from '~/table/constants.js'
import type { Table } from '~/table/index.js'
import { Table_ } from '~/table/index.js'
import type { Index, Key } from '~/table/types/index.js'
import type { NarrowObject, NarrowObjectRec } from '~/types/narrowObject.js'

export class DBTable<
  PARTITION_KEY extends Key = Key,
  SORT_KEY extends Key = Key,
  INDEXES extends Record<string, Index> = Key extends PARTITION_KEY ? Record<string, Index> : {},
  ENTITY_ATTRIBUTE_SAVED_AS extends string = Key extends PARTITION_KEY ? string : '_et',
  ENTITIES extends Entity[] = Entity[],
  ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern> = Record<
    string,
    ITableAccessPattern | IEntityAccessPattern
  >
> extends Table_<PARTITION_KEY, SORT_KEY, INDEXES, ENTITY_ATTRIBUTE_SAVED_AS> {
  static fromTable<TABLE extends Table | Table_>(table: TABLE): ToDBTable<TABLE> {
    return new DBTable<
      TABLE['partitionKey'],
      NonNullable<TABLE['sortKey']>,
      TABLE['indexes'],
      TABLE['entityAttributeSavedAs'],
      TABLE extends Table_ ? TABLE[$entities] : Entity[],
      TABLE extends Table_ ? TABLE[$accessPatterns] : {}
    >(
      /**
       * @debt v3 "Just provide `table` once name is renamed to tableName"
       */
      {
        documentClient: table.documentClient,
        name: table.tableName,
        partitionKey: table.partitionKey as TABLE['partitionKey'],
        sortKey: table.sortKey as NonNullable<TABLE['sortKey']>,
        indexes: table.indexes as TABLE['indexes'],
        entityAttributeSavedAs: table.entityAttributeSavedAs as TABLE['entityAttributeSavedAs']
      },
      table instanceof Table_ ? table[$entities] : [],
      table instanceof Table_ ? table[$accessPatterns] : {}
    )
  }

  // @ts-ignore
  override entities: { [ENTITY in ENTITIES[number] as ENTITY['entityName']]: ENTITY }
  // @ts-ignore
  override accessPatterns: ACCESS_PATTERNS
  query: { [KEY in keyof ACCESS_PATTERNS]: ACCESS_PATTERNS[KEY]['query'] }

  constructor(
    args: {
      documentClient?: DynamoDBDocumentClient
      name?: string | (() => string)
      partitionKey: NarrowObject<PARTITION_KEY>
      sortKey?: NarrowObject<SORT_KEY>
      indexes?: NarrowObjectRec<INDEXES>
      entityAttributeSavedAs?: ENTITY_ATTRIBUTE_SAVED_AS
    },
    entities = [] as unknown as ENTITIES,
    accessPatterns = {} as ACCESS_PATTERNS
  ) {
    super(args, entities, accessPatterns)

    this.entities = Object.fromEntries(
      entities.map((entity: Entity) => [entity.entityName, entity])
    ) as { [ENTITY in ENTITIES[number] as ENTITY['entityName']]: ENTITY }

    this.accessPatterns = accessPatterns

    this.query = Object.fromEntries(
      Object.entries(accessPatterns).map(([key, ap]) => [
        key,
        input => (ap as ITableAccessPattern | IEntityAccessPattern).query(input)
      ])
    ) as { [KEY in keyof ACCESS_PATTERNS]: ACCESS_PATTERNS[KEY]['query'] }
  }
}

export type ToDBTable<TABLE extends Table | Table_> = DBTable<
  TABLE['partitionKey'],
  NonNullable<TABLE['sortKey']>,
  TABLE['indexes'],
  TABLE['entityAttributeSavedAs'],
  TABLE extends Table_ ? TABLE[$entities] : Entity[],
  TABLE extends Table_ ? TABLE[$accessPatterns] : {}
>
