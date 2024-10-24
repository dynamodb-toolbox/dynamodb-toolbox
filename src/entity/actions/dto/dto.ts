import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { SchemaDTO } from '~/schema/actions/dto/index.js'
import { TableDTO } from '~/table/actions/dto/index.js'

import type { IEntityDTO } from './schema.js'

export class EntityDTO<ENTITY extends Entity = Entity>
  extends EntityAction<ENTITY>
  implements IEntityDTO
{
  static override actionName = 'dto' as const
  name: string
  schema: IEntityDTO['schema']
  entityAttributeName: IEntityDTO['entityAttributeName']
  entityAttributeHidden: IEntityDTO['entityAttributeHidden']
  timestamps: IEntityDTO['timestamps']
  table: IEntityDTO['table']

  constructor(entity: ENTITY) {
    super(entity)
    this.name = this.entity.name
    this.schema = this.entity.constructorSchema.build(SchemaDTO).toJSON()
    this.entityAttributeName = this.entity.entityAttributeName
    this.entityAttributeHidden = this.entity.entityAttributeHidden
    this.timestamps = this.entity.timestamps
    this.table = this.entity.table.build(TableDTO).toJSON()
  }

  toJSON(): IEntityDTO {
    return {
      name: this.name,
      schema: this.schema,
      entityAttributeName: this.entity.entityAttributeName,
      entityAttributeHidden: this.entity.entityAttributeHidden,
      timestamps: this.entity.timestamps,
      table: this.table
    }
  }
}
