import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

export class EntityCommand<ENTITY extends EntityV2 = EntityV2> {
  static commandType = 'entity'
  static commandName: string

  protected _entity: ENTITY

  constructor(entity: ENTITY) {
    this._entity = entity
  }
}

export class TableCommand<TABLE extends TableV2 = TableV2, ENTITIES extends EntityV2 = EntityV2> {
  static commandType = 'table'
  static commandName: string

  protected _table: TABLE
  protected _entities: ENTITIES[]

  constructor({ table, entities = [] }: { table: TABLE; entities?: ENTITIES[] }) {
    this._table = table
    this._entities = entities
  }
}
