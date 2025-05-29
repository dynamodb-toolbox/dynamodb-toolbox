import type { IAccessPattern as IEntityAccessPattern } from '~/entity/actions/accessPattern/index.js'
import type { Entity } from '~/entity/index.js'
import type { IAccessPattern as ITableAccessPattern } from '~/table/actions/accessPattern/index.js'
import type { Table } from '~/table/index.js'
import { $entities, TableAction } from '~/table/index.js'

export class Registry<
  TABLE extends Table = Table,
  ENTITIES extends Entity[] = Entity[],
  ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern> = Record<
    string,
    ITableAccessPattern | IEntityAccessPattern
  >
> extends TableAction<TABLE, ENTITIES> {
  static override actionName = 'registry' as const

  readonly entities: RegistryEntities<ENTITIES>
  readonly accessPatterns: ACCESS_PATTERNS
  readonly query: RegistryQueries<ACCESS_PATTERNS>

  constructor(
    table: TABLE,
    _entities = [] as unknown as ENTITIES,
    accessPatterns = {} as ACCESS_PATTERNS,
    {
      entities = registryEntities(_entities),
      query = registryQueries(accessPatterns)
    }: { entities?: RegistryEntities<ENTITIES>; query?: RegistryQueries<ACCESS_PATTERNS> } = {}
  ) {
    super(table, _entities)

    this.entities = entities
    this.accessPatterns = accessPatterns
    this.query = query
  }

  registerEntities<NEXT_ENTITIES extends Entity[]>(
    ...nextEntities: NEXT_ENTITIES
  ): Registry<TABLE, NEXT_ENTITIES> {
    return new Registry(this.table, nextEntities, this.accessPatterns, {
      entities: registryEntities(nextEntities),
      query: this.query
    })
  }

  registerAccessPatterns<
    NEXT_ACCESS_PATTERNS extends Record<string, ITableAccessPattern | IEntityAccessPattern>
  >(nextAccessPatterns: NEXT_ACCESS_PATTERNS): Registry<TABLE, ENTITIES, NEXT_ACCESS_PATTERNS> {
    return new Registry<TABLE, ENTITIES, NEXT_ACCESS_PATTERNS>(
      this.table,
      this[$entities],
      nextAccessPatterns,
      { entities: this.entities, query: registryQueries(nextAccessPatterns) }
    )
  }

  build<ACTION extends TableAction<TABLE, ENTITIES> = TableAction<TABLE, ENTITIES>>(
    Action: new (table: TABLE, entities?: ENTITIES) => ACTION
  ): ACTION {
    return new Action(this.table, this[$entities])
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
