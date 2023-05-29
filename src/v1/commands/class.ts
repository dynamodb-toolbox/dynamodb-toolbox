import type { EntityV2 } from '../entity/class'

export class CommandClass<ENTITY extends EntityV2 = EntityV2> {
  public entity: ENTITY

  constructor(entity: ENTITY) {
    this.entity = entity
  }
}
