import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { JSONizer } from '~/schema/actions/jsonize/index.js'
import { TableJSONizer } from '~/table/actions/jsonize/jsonize.js'

import { $schemaJsonizer, $tableJsonizer } from './constants.js'
import type { JSONizedEntity } from './schema.js'

export class EntityJSONizer<ENTITY extends Entity = Entity> extends EntityAction<ENTITY> {
  static override actionName = 'jsonize' as const;
  [$schemaJsonizer]: JSONizer<ENTITY['schema']>;
  [$tableJsonizer]: TableJSONizer<ENTITY['table']>

  constructor(entity: ENTITY) {
    super(entity)
    this[$schemaJsonizer] = this.entity.constructorSchema.build(JSONizer)
    this[$tableJsonizer] = this.entity.table.build(TableJSONizer)
  }

  jsonize(): JSONizedEntity {
    return {
      type: 'entity',
      name: this.entity.name,
      schema: this[$schemaJsonizer].jsonize(),
      entityAttributeName: this.entity.entityAttributeName,
      entityAttributeHidden: this.entity.entityAttributeHidden,
      timestamps: this.entity.timestamps,
      table: this[$tableJsonizer].jsonize()
    }
  }
}
