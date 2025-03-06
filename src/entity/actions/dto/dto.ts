import type { Entity } from '~/entity/index.js'
import { EntityAction } from '~/entity/index.js'
import { SchemaDTO } from '~/schema/actions/dto/index.js'
import type { ItemSchemaDTO } from '~/schema/actions/dto/types.js'
import { ItemSchema } from '~/schema/item/schema.js'
import type { ITableDTO } from '~/table/actions/dto/index.js'
import { TableDTO } from '~/table/actions/dto/index.js'

type EntityAttrOption = boolean | { name?: string; hidden?: boolean }

type TimestampOption = boolean | { name?: string; savedAs?: string; hidden?: boolean }

type TimestampOptions = boolean | { created: TimestampOption; modified: TimestampOption }

export interface IEntityDTO {
  entityName: string
  entityAttribute?: EntityAttrOption
  timestamps?: TimestampOptions
  schema: ItemSchemaDTO
  table: ITableDTO
}

export class EntityDTO<ENTITY extends Entity = Entity>
  extends EntityAction<ENTITY>
  implements IEntityDTO
{
  static override actionName = 'dto' as const

  entityName: string
  schema: SchemaDTO
  entityAttribute: IEntityDTO['entityAttribute']
  timestamps: IEntityDTO['timestamps']
  table: TableDTO

  constructor(entity: ENTITY) {
    super(entity)

    const constructorShemaDTO = new SchemaDTO(new ItemSchema(this.entity.attributes))

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

    this.entityName = this.entity.entityName
    this.schema = constructorShemaDTO
    this.entityAttribute = this.entity.entityAttribute
    this.timestamps = this.entity.timestamps
    this.table = this.entity.table.build(TableDTO)
  }

  toJSON(): IEntityDTO {
    return {
      entityName: this.entityName,
      schema: this.schema.toJSON() as ItemSchemaDTO,
      entityAttribute: this.entity.entityAttribute,
      timestamps: this.entity.timestamps,
      table: this.table.toJSON()
    }
  }
}
