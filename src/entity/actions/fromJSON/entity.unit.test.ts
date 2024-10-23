import type { JSONizedEntity } from '~/entity/actions/jsonize/index.js'
import { Entity } from '~/entity/index.js'
import { fromJSON as fromSchemaJSON } from '~/schema/actions/fromJSON/index.js'
import { fromJSON as fromTableJSON } from '~/table/actions/fromJSON/index.js'

import { fromJSON } from './entity.js'

describe('fromJSON - entity', () => {
  test('creates correct entity', () => {
    const jsonizedEntity: JSONizedEntity = {
      type: 'entity',
      name: 'pokemons',
      schema: {
        type: 'schema',
        attributes: {
          pk: { type: 'string', key: true }
        }
      },
      entityAttributeName: '__entity__',
      entityAttributeHidden: false,
      timestamps: {
        created: { hidden: false, name: 'createdAt' },
        modified: false
      },
      table: {
        type: 'table',
        partitionKey: { type: 'string', name: 'pk' },
        entityAttributeSavedAs: '__et__'
      }
    }

    const importedEntity = fromJSON(jsonizedEntity)

    expect(importedEntity).toBeInstanceOf(Entity)
    expect(importedEntity.name).toBe('pokemons')

    expect(importedEntity.constructorSchema).toMatchObject(fromSchemaJSON(jsonizedEntity.schema))

    // We have to do this to avoid reference inequalities
    const receivedTable = JSON.parse(JSON.stringify(importedEntity.table))
    const expectedTable = JSON.parse(JSON.stringify(fromTableJSON(jsonizedEntity.table)))
    expect(receivedTable).toMatchObject(expectedTable)

    expect(importedEntity.entityAttributeName).toBe('__entity__')
    expect(importedEntity.entityAttributeHidden).toBe(false)

    expect(importedEntity.timestamps).toStrictEqual({
      created: { hidden: false, name: 'createdAt' },
      modified: false
    })
  })
})
