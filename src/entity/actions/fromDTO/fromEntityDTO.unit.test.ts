import type { IEntityDTO } from '~/entity/actions/dto/index.js'
import { Entity } from '~/entity/index.js'
import { fromSchemaDTO } from '~/schema/actions/fromDTO/index.js'
import { fromTableDTO } from '~/table/actions/fromDTO/index.js'

import { fromEntityDTO } from './fromEntityDTO.js'

describe('fromDTO - entity', () => {
  test('creates correct entity', () => {
    const entityDTO: IEntityDTO = {
      entityName: 'pokemons',
      schema: {
        type: 'item',
        attributes: {
          pk: { type: 'string', key: true, required: 'always' }
        }
      },
      entityAttribute: { name: '__entity__', hidden: false },
      timestamps: {
        created: { hidden: false, name: 'createdAt' },
        modified: false
      },
      table: {
        partitionKey: { type: 'string', name: 'pk' },
        entityAttributeSavedAs: '__et__'
      }
    }

    const entity = fromEntityDTO(entityDTO)

    expect(entity).toBeInstanceOf(Entity)
    expect(entity.entityName).toBe('pokemons')

    expect(entity.attributes).toMatchObject(fromSchemaDTO(entityDTO.schema).attributes)

    // We have to do this to avoid reference inequalities
    const receivedTable = JSON.parse(JSON.stringify(entity.table))
    const expectedTable = JSON.parse(JSON.stringify(fromTableDTO(entityDTO.table)))
    expect(receivedTable).toMatchObject(expectedTable)

    expect(entity.entityAttribute).toStrictEqual({ name: '__entity__', hidden: false })

    expect(entity.timestamps).toStrictEqual({
      created: { hidden: false, name: 'createdAt' },
      modified: false
    })
  })

  test('creates customized entity', () => {
    const entityDTO: IEntityDTO = {
      entityName: 'pokemons',
      schema: {
        type: 'item',
        attributes: {
          pk: { type: 'string', key: true, required: 'always' }
        }
      },
      entityAttribute: false,
      timestamps: false,
      table: {
        partitionKey: { type: 'string', name: 'pk' },
        entityAttributeSavedAs: '__et__'
      }
    }

    const entity = fromEntityDTO(entityDTO)

    expect(entity).toBeInstanceOf(Entity)
    expect(entity.entityName).toBe('pokemons')

    expect(entity.attributes).toMatchObject(fromSchemaDTO(entityDTO.schema).attributes)

    expect(entity.entityAttribute).toBe(false)
    expect(entity.timestamps).toBe(false)
  })
})
