import type { IEntityDTO } from '~/entity/actions/dto/index.js'
import { Entity } from '~/entity/index.js'
import { fromSchemaDTO } from '~/schema/actions/fromDTO/index.js'
import { fromTableDTO } from '~/table/actions/fromDTO/index.js'

import { fromEntityDTO } from './fromEntityDTO.js'

describe('fromDTO - entity', () => {
  test('creates correct entity', () => {
    const entityDTO: IEntityDTO = {
      name: 'pokemons',
      schema: {
        type: 'schema',
        attributes: {
          pk: { type: 'string', key: true, required: 'always' }
        }
      },
      entityAttributeName: '__entity__',
      entityAttributeHidden: false,
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
    expect(entity.name).toBe('pokemons')

    expect(entity.constructorSchema).toMatchObject(fromSchemaDTO(entityDTO.schema))

    // We have to do this to avoid reference inequalities
    const receivedTable = JSON.parse(JSON.stringify(entity.table))
    const expectedTable = JSON.parse(JSON.stringify(fromTableDTO(entityDTO.table)))
    expect(receivedTable).toMatchObject(expectedTable)

    expect(entity.entityAttributeName).toBe('__entity__')
    expect(entity.entityAttributeHidden).toBe(false)

    expect(entity.timestamps).toStrictEqual({
      created: { hidden: false, name: 'createdAt' },
      modified: false
    })
  })
})
