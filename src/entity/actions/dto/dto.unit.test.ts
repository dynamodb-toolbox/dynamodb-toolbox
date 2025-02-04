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
      entityName: 'simple',
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
      entityName: 'rich',
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

  test('appends PK/SK if they miss from the schema', () => {
    const sortedTable = new Table({
      partitionKey: { name: 'pk', type: 'string' },
      sortKey: { name: 'sk', type: 'string' }
    })

    const entity = new Entity({
      name: 'entity',
      schema: schema({ key: string().key(), attr: string() }),
      computeKey: ({ key }) => ({ pk: key, sk: key }),
      table: sortedTable
    })

    const dto = entity.build(EntityDTO)

    const entityObj = JSON.parse(JSON.stringify(dto))
    expect(entityObj).toMatchObject({
      schema: {
        attributes: {
          pk: { type: 'string', key: true, required: 'always', hidden: true },
          sk: { type: 'string', key: true, required: 'always', hidden: true }
        }
      }
    })
  })

  test('does not append PK/SK if they are savedAs in the schema', () => {
    const entity = new Entity({
      name: 'entity',
      schema: schema({ key: string().key().savedAs('pk'), attr: string() }),
      table
    })

    const dto = entity.build(EntityDTO)

    const entityObj = JSON.parse(JSON.stringify(dto))
    expect(entityObj).not.toMatchObject({
      schema: {
        attributes: {
          pk: { key: true }
        }
      }
    })
  })
})
