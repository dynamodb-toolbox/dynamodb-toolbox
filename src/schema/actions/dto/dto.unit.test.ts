import type { A } from 'ts-toolbelt'

import { any } from '~/attributes/any/index.js'
import { anyOf } from '~/attributes/anyOf/index.js'
import { binary } from '~/attributes/binary/index.js'
import { boolean } from '~/attributes/boolean/index.js'
import { item } from '~/attributes/item/index.js'
import { list } from '~/attributes/list/index.js'
import { map } from '~/attributes/map/index.js'
import { nul } from '~/attributes/null/index.js'
import { number } from '~/attributes/number/index.js'
import { record } from '~/attributes/record/index.js'
import { set } from '~/attributes/set/index.js'
import { string } from '~/attributes/string/index.js'

import { SchemaDTO } from './dto.js'
import type { ItemSchemaDTO } from './types.js'

describe('dto', () => {
  test('correctly builds simple schema DTO', () => {
    const simpleSchema = item({
      any: any(),
      null: nul(),
      bool: boolean(),
      num: number(),
      str: string(),
      bin: binary(),
      st: set(string()),
      lst: list(string()),
      mp: map({
        str: string(),
        num: number()
      }),
      recrd: record(string(), string()),
      union: anyOf(string(), number())
    })

    const dto = simpleSchema.build(SchemaDTO)

    const assertJSON: A.Contains<typeof dto, ItemSchemaDTO> = 1
    assertJSON

    const schemaObj = JSON.parse(JSON.stringify(dto))
    expect(schemaObj).toStrictEqual({
      type: 'item',
      attributes: {
        any: { type: 'any' },
        null: { type: 'null' },
        bool: { type: 'boolean' },
        num: { type: 'number' },
        str: { type: 'string' },
        bin: { type: 'binary' },
        lst: {
          type: 'list',
          elements: { type: 'string' }
        },
        mp: {
          type: 'map',
          attributes: {
            num: { type: 'number' },
            str: { type: 'string' }
          }
        },
        recrd: {
          type: 'record',
          elements: { type: 'string' },
          keys: { type: 'string' }
        },
        st: {
          type: 'set',
          elements: { type: 'string' }
        },
        union: {
          type: 'anyOf',
          elements: [{ type: 'string' }, { type: 'number' }]
        }
      }
    })
  })

  test('correctly builds rich schema DTO', () => {
    const richSchema = item({
      any: any().key(),
      null: nul().hidden(),
      bool: boolean().required('always'),
      num: number().enum(1, 2, 3),
      str: string().savedAs('_st')
    })

    const dto = richSchema.build(SchemaDTO)

    const assertJSON: A.Contains<typeof dto, ItemSchemaDTO> = 1
    assertJSON

    const schemaObj = JSON.parse(JSON.stringify(dto))
    expect(schemaObj).toStrictEqual({
      type: 'item',
      attributes: {
        any: { type: 'any', required: 'always', key: true },
        null: { type: 'null', hidden: true },
        bool: { type: 'boolean', required: 'always' },
        num: { type: 'number', enum: [1, 2, 3] },
        str: { type: 'string', savedAs: '_st' }
      }
    })
  })
})
