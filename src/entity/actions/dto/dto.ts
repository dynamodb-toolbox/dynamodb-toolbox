import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { SchemaDTO } from '~/schema/actions/dto/index.js'
import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import { TableDTO } from '~/table/actions/dto/index.js'
import type { ITableDTO } from '~/table/actions/dto/index.js'

type TimestampOption = boolean | { name?: string; savedAs?: string; hidden?: boolean }

type TimestampOptions = boolean | { created: TimestampOption; modified: TimestampOption }

export interface IEntityDTO {
  name: string
  entityAttributeName?: string
  entityAttributeHidden?: boolean
  timestamps?: TimestampOptions
  schema: ISchemaDTO
  table: ITableDTO
}

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

    if (entity.computeKey !== undefined) {
      console.warn(
        'Entity DTO schema is probably incomplete when using `computeKey`: Please define explicit Primary Key attributes and use `links` instead (https://www.dynamodbtoolbox.com/docs/schemas/defaults-and-links#links).'
      )
    }

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
