import type { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

import type { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import type { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import { $interceptor } from '~/table/constants.js'
import type { Table, TableMetadata, TableSendableAction } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

export class Registry<
    TABLE extends Table = Table,
    ENTITIES extends Entity[] = Entity[],
    ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern> = Record<
      string,
      ITableAccessPattern | IEntityAccessPattern
    >
  >
  extends TableAction<TABLE, ENTITIES>
  implements
    Table<
      TABLE['partitionKey'],
      NonNullable<TABLE['sortKey']>,
      TABLE['indexes'],
      TABLE['entityAttributeSavedAs']
    >
{
  static override actionName = 'registered-table' as const

  readonly partitionKey: TABLE['partitionKey']
  readonly sortKey?: TABLE['sortKey']
  readonly indexes: TABLE['indexes']
  readonly entityAttributeSavedAs: TABLE['entityAttributeSavedAs']
  readonly getName: TABLE['getName']
  readonly getDocumentClient: TABLE['getDocumentClient'];

  [$interceptor]?: (action: TableSendableAction) => any

  readonly entities: RegistryEntities<ENTITIES>
  readonly accessPatterns: ACCESS_PATTERNS
  readonly query: RegistryQueries<ACCESS_PATTERNS>

  constructor(
    table: TABLE,
    entities = [] as unknown as ENTITIES,
    accessPatterns = {} as ACCESS_PATTERNS
  ) {
    super(table, entities)

    this.partitionKey = table.partitionKey
    this.sortKey = table.sortKey
    this.indexes = table.indexes
    this.entityAttributeSavedAs = table.entityAttributeSavedAs
    this.getName = table.getName
    this.getDocumentClient = table.getDocumentClient

    this.entities = registryEntities(entities)
    this.accessPatterns = accessPatterns
    this.query = registryQueries(accessPatterns)
  }

  get documentClient(): DynamoDBDocumentClient | undefined {
    return this.table.documentClient
  }

  set documentClient(documentClient: DynamoDBDocumentClient | undefined) {
    this.table.documentClient = documentClient
  }

  get meta(): TableMetadata {
    return this.table.meta
  }

  set meta(meta: TableMetadata) {
    this.table.meta = meta
  }

  registerEntities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): Registry<TABLE, NEXT_ENTITIES> {
    return new Registry(this.table, nextEntities)
  }

  registerAccessPatterns<
    NEXT_ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern>
  >(nextAccessPatterns: NEXT_ACCESS_PATTERNS): Registry<TABLE, ENTITIES, NEXT_ACCESS_PATTERNS> {
    return new Registry<TABLE, ENTITIES, NEXT_ACCESS_PATTERNS>(
      this.table,
      this[$entities],
      nextAccessPatterns
    )
  }

  // @ts-ignore
  build<ACTION extends TableAction<this, this[$entities]> = TableAction<this, this[$entities]>>(
    Action: new (table: this, entities?: this[$entities]) => ACTION
  ): ACTION {
    return new Action(this, this[$entities])
  }
}

const registryQueries = <
  ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern>
>(
  accessPatterns: ACCESS_PATTERNS
): RegistryQueries<ACCESS_PATTERNS> =>
  Object.fromEntries(
    Object.entries(accessPatterns).map(([key, ap]) => [
      key,
      input => (ap as ITableAccessPattern | IEntityAccessPattern).query(input)
    ])
  ) as RegistryQueries<ACCESS_PATTERNS>

type RegistryQueries<
  ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern>
> = { [KEY in keyof ACCESS_PATTERNS]: ACCESS_PATTERNS[KEY]['query'] }

const registryEntities = <ENTITIES extends Entity[]>(
  entities: ENTITIES
): RegistryEntities<ENTITIES> =>
  Object.fromEntries(
    entities.map((entity: Entity) => [entity.entityName, entity])
  ) as RegistryEntities<ENTITIES>

type RegistryEntities<ENTITIES extends Entity[]> = {
  [ENTITY in ENTITIES[number] as ENTITY['entityName']]: ENTITY
}
