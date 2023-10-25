import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

// TODO: Rename EntityCommandClass (or simply EntityCommand ?)
export class CommandClass<ENTITY extends EntityV2 = EntityV2> {
  public entity: ENTITY

  constructor(entity: ENTITY) {
    this.entity = entity
  }
}

export class TableCommandClass<TABLE extends TableV2 = TableV2> {
  public table: TABLE

  constructor(table: TABLE) {
    this.table = table
  }
}
