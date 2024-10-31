import type { A } from 'ts-toolbelt'

import { string } from '~/attributes/string/index.js'
import { Entity } from '~/entity/entity.js'
import { schema } from '~/schema/index.js'
import { Table } from '~/table/table.js'

import { EntityDTO } from './dto.js'
import type { IEntityDTO } from './dto.js'

const table = new Table({
  partitionKey: { name: 'pk', type: 'string' }
})

describe('DTO', () => {
  test('correctly builds simple schema DTO', () => {
    const simpleEntity = new Entity({
      name: 'simple',
      schema: schema({
        pk: string().key(),
        attr: string()
      }),
      table
    })

    const dto = simpleEntity.build(EntityDTO)

    const assertJSON: A.Contains<typeof dto, IEntityDTO> = 1
    assertJSON

    const entityObj = JSON.parse(JSON.stringify(dto))
    expect(entityObj).toStrictEqual({
      name: 'simple',
      schema: {
        type: 'schema',
        attributes: {
          pk: { type: 'string', key: true, required: 'always' },
          attr: { type: 'string' }
        }
      },
      entityAttributeName: 'entity',
      entityAttributeHidden: true,
      timestamps: true,
      table: {
        entityAttributeSavedAs: '_et',
        partitionKey: { name: 'pk', type: 'string' }
      }
    })
  })

  test('correctly builds rich schema DTO', () => {
    const richEntity = new Entity({
      name: 'rich',
      schema: schema({
        pk: string().key(),
        attr: string()
      }),
      entityAttributeName: '__ent__',
      entityAttributeHidden: false,
      timestamps: {
        created: { hidden: false, name: 'createdAt' },
        modified: false
      },
      table
    })

    const dto = richEntity.build(EntityDTO)

    const assertJSON: A.Contains<typeof dto, IEntityDTO> = 1
    assertJSON

    const entityObj = JSON.parse(JSON.stringify(dto))
    expect(entityObj).toStrictEqual({
      name: 'rich',
      schema: {
        type: 'schema',
        attributes: {
          pk: { type: 'string', key: true, required: 'always' },
          attr: { type: 'string' }
        }
      },
      entityAttributeName: '__ent__',
      entityAttributeHidden: false,
      timestamps: {
        created: { hidden: false, name: 'createdAt' },
        modified: false
      },
      table: {
        entityAttributeSavedAs: '_et',
        partitionKey: { name: 'pk', type: 'string' }
      }
    })
  })
})
