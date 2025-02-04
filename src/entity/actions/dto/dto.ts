import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { SchemaDTO } from '~/schema/actions/dto/index.js'
import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import { TableDTO } from '~/table/actions/dto/index.js'
import type { ITableDTO } from '~/table/actions/dto/index.js'

type TimestampOption = boolean | { name?: string; savedAs?: string; hidden?: boolean }

type TimestampOptions = boolean | { created: TimestampOption; modified: TimestampOption }

export interface IEntityDTO {
  entityName: string
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
  entityName: string
  schema: SchemaDTO
  entityAttributeName: IEntityDTO['entityAttributeName']
  entityAttributeHidden: IEntityDTO['entityAttributeHidden']
  timestamps: IEntityDTO['timestamps']
  table: TableDTO

  constructor(entity: ENTITY) {
    super(entity)

    const constructorShemaDTO = this.entity.constructorSchema.build(SchemaDTO)

    const { partitionKey, sortKey } = this.entity.table
    const partitionKeyAttr = Object.entries(constructorShemaDTO.attributes).find(
      ([attrName, attr]) => (attr.savedAs ?? attrName) === partitionKey.name
    )
    if (partitionKeyAttr === undefined) {
      constructorShemaDTO.attributes[partitionKey.name] = {
        type: partitionKey.type,
        key: true,
        required: 'always',
        hidden: true
      }
    }

    if (sortKey !== undefined) {
      const sortKeyAttr = Object.entries(constructorShemaDTO.attributes).find(
        ([attrName, attr]) => (attr.savedAs ?? attrName) === sortKey.name
      )

      if (sortKeyAttr === undefined) {
        constructorShemaDTO.attributes[sortKey.name] = {
          type: sortKey.type,
          key: true,
          required: 'always',
          hidden: true
        }
      }
    }

    this.entityName = this.entity.name
    this.schema = constructorShemaDTO
    this.entityAttributeName = this.entity.entityAttributeName
    this.entityAttributeHidden = this.entity.entityAttributeHidden
    this.timestamps = this.entity.timestamps
    this.table = this.entity.table.build(TableDTO)
  }

  toJSON(): IEntityDTO {
    return {
      entityName: this.entityName,
      schema: this.schema.toJSON(),
      entityAttributeName: this.entity.entityAttributeName,
      entityAttributeHidden: this.entity.entityAttributeHidden,
      timestamps: this.entity.timestamps,
      table: this.table.toJSON()
    }
  }
}
