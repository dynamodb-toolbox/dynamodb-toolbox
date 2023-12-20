import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

export class EntityCommand<ENTITY extends EntityV2 = EntityV2> {
  static commandType = 'entity'
  static commandName: string

  public _entity: ENTITY

  constructor(entity: ENTITY) {
    this._entity = entity
  }
}

export class TableCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[]
> {
  static commandType = 'table'
  static commandName: string

  public _table: TABLE
  public _entities: ENTITIES

  constructor({
    table,
    entities = ([] as unknown) as ENTITIES
  }: {
    table: TABLE
    entities?: ENTITIES
  }) {
    this._table = table
    this._entities = entities
  }
}
