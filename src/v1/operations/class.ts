import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

export class EntityOperation<ENTITY extends EntityV2 = EntityV2> {
  static operationType = 'entity'
  static operationName: string

  public _entity: ENTITY

  constructor(entity: ENTITY) {
    this._entity = entity
  }
}

export class TableCommand<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[]
> {
  static operationType = 'table'
  static operationName: string

  public _table: TABLE
  public _entities: ENTITIES

  constructor(table: TABLE, entities = ([] as unknown) as ENTITIES) {
    this._table = table
    this._entities = entities
  }
}
