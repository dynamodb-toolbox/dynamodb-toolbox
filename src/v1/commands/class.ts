import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

// TODO: Rename EntityCommandClass (or simply EntityCommand ?)
export class CommandClass<ENTITY extends EntityV2 = EntityV2> {
  public entity: ENTITY

  constructor(entity: ENTITY) {
    this.entity = entity
  }
}

export class TableCommandClass<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2 = EntityV2
> {
  public _table: TABLE
  public _entities: ENTITIES[]

  constructor({ table, entities = [] }: { table: TABLE; entities?: ENTITIES[] }) {
    this._table = table
    this._entities = entities
  }
}
