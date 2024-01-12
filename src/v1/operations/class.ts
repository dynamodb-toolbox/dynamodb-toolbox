import type { EntityV2 } from '../entity/class'
import type { TableV2 } from '../table/class'

export const $entity = Symbol('$entity')
export type $entity = typeof $entity

export const $entities = Symbol('$entities')
export type $entities = typeof $entities

export const $table = Symbol('$table')
export type $table = typeof $table

export class EntityOperation<ENTITY extends EntityV2 = EntityV2> {
  static operationType = 'entity'
  static operationName: string;

  [$entity]: ENTITY

  constructor(entity: ENTITY) {
    this[$entity] = entity
  }
}

export class TableOperation<
  TABLE extends TableV2 = TableV2,
  ENTITIES extends EntityV2[] = EntityV2[]
> {
  static operationType = 'table'
  static operationName: string;

  [$table]: TABLE;
  [$entities]: ENTITIES

  constructor(table: TABLE, entities = ([] as unknown) as ENTITIES) {
    this[$table] = table
    this[$entities] = entities
  }
}
