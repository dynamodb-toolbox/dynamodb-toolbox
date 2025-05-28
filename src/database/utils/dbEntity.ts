import { $meta } from '~/entity/constants.js'
import type { Entity, EntityAction, EntityMetadata } from '~/entity/index.js'

import { $entity } from '../constants.js'

export class DB<ENTITY extends Entity = Entity> {
  [$entity]: ENTITY
  meta: EntityMetadata

  // Original Entity Props & methods
  readonly type: ENTITY['type']
  readonly entityName: ENTITY['entityName']
  readonly table: ENTITY['table']
  readonly attributes: ENTITY['attributes']
  readonly schema: ENTITY['schema']
  readonly entityAttribute: ENTITY['entityAttribute']
  readonly timestamps: ENTITY['timestamps']
  // any is needed for contravariance
  readonly computeKey?: ENTITY['computeKey']

  constructor(entity: ENTITY) {
    this[$entity] = entity
    this.meta = entity[$meta]

    this.type = entity.type
    this.entityName = entity.entityName
    this.table = entity.table
    this.attributes = entity.attributes
    this.schema = entity.schema
    this.entityAttribute = entity.entityAttribute
    this.timestamps = entity.timestamps
    this.computeKey = entity.computeKey
  }

  build<ACTION extends EntityAction<ENTITY> = EntityAction<ENTITY>>(
    Action: new (entity: ENTITY) => ACTION
  ): ACTION {
    return new Action(this[$entity])
  }
}
