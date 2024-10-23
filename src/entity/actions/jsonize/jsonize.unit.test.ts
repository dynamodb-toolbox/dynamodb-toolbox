import type { A } from 'ts-toolbelt'

import { string } from '~/attributes/string/index.js'
import { Entity } from '~/entity/entity.js'
import { schema } from '~/schema/index.js'
import { Table } from '~/table/table.js'

import { EntityJSONizer } from './jsonize.js'
import type { JSONizedEntity } from './schema.js'

const table = new Table({
  partitionKey: { name: 'pk', type: 'string' }
})

describe('jsonize', () => {
  test('correctly jsonize simple schema', () => {
    const simpleEntity = new Entity({
      name: 'simple',
      schema: schema({
        pk: string().key(),
        attr: string()
      }),
      table
    })

    const json = simpleEntity.build(EntityJSONizer).jsonize()

    const assertJSON: A.Equals<typeof json, JSONizedEntity> = 1
    assertJSON

    expect(json).toStrictEqual({
      type: 'entity',
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
        partitionKey: { name: 'pk', type: 'string' },
        type: 'table'
      }
    })
  })

  test('correctly jsonize rich schema', () => {
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

    const json = richEntity.build(EntityJSONizer).jsonize()

    const assertJSON: A.Equals<typeof json, JSONizedEntity> = 1
    assertJSON

    expect(json).toStrictEqual({
      type: 'entity',
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
        partitionKey: { name: 'pk', type: 'string' },
        type: 'table'
      }
    })
  })
})
