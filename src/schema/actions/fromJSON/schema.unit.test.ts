import {
  AnyOfAttribute,
  BinaryAttribute,
  BooleanAttribute,
  ListAttribute,
  MapAttribute,
  NumberAttribute,
  RecordAttribute,
  SetAttribute,
  StringAttribute
} from '~/attributes/index.js'
import type { PrimitiveAttribute } from '~/attributes/index.js'
import type { JSONizedSchema } from '~/schema/actions/jsonize/index.js'
import { Schema } from '~/schema/index.js'

import { fromJSON } from './schema.js'

describe('fromJSON - schema', () => {
  test('creates correct schema', () => {
    const jsonizedSchema: JSONizedSchema = {
      type: 'schema',
      attributes: {
        boolean: { type: 'boolean', key: true },
        number: { type: 'number', enum: [0, 1, 2] },
        str: { type: 'string', required: 'always' },
        binary: { type: 'binary', savedAs: '_b', enum: ['AQID', 'BAUG'] },
        set: { type: 'set', elements: { type: 'string' } },
        list: { type: 'list', elements: { type: 'number' } },
        map: {
          type: 'map',
          attributes: {
            str: { type: 'string' },
            num: { type: 'number' }
          }
        },
        record: {
          type: 'record',
          keys: { type: 'string', enum: ['a', 'b', 'c'] },
          elements: { type: 'string' }
        },
        anyOf: {
          type: 'anyOf',
          elements: [{ type: 'string' }, { type: 'null' }]
        }
      }
    }

    const importedSchema = fromJSON(jsonizedSchema)

    expect(importedSchema).toBeInstanceOf(Schema)

    const { attributes } = importedSchema

    expect(attributes.boolean).toBeInstanceOf(BooleanAttribute)
    expect(attributes.boolean?.type).toBe('boolean')
    expect(attributes.boolean?.key).toBe(true)

    expect(attributes.number).toBeInstanceOf(NumberAttribute)
    expect(attributes.number?.type).toBe('number')
    expect((attributes.number as NumberAttribute).enum).toStrictEqual([0, 1, 2])

    expect(attributes.str).toBeInstanceOf(StringAttribute)
    expect(attributes.str?.type).toBe('string')
    expect(attributes.str?.required).toBe('always')

    expect(attributes.binary).toBeInstanceOf(BinaryAttribute)
    expect(attributes.binary?.type).toBe('binary')
    expect(attributes.binary?.savedAs).toBe('_b')
    expect((attributes.binary as PrimitiveAttribute).enum).toStrictEqual([
      new Uint8Array([1, 2, 3]),
      new Uint8Array([4, 5, 6])
    ])

    expect(attributes.set).toBeInstanceOf(SetAttribute)
    expect(attributes.set?.type).toBe('set')
    expect((attributes.set as SetAttribute).elements.type).toBe('string')

    expect(attributes.list).toBeInstanceOf(ListAttribute)
    expect(attributes.list?.type).toBe('list')
    expect((attributes.list as SetAttribute).elements.type).toBe('number')

    expect(attributes.map).toBeInstanceOf(MapAttribute)
    expect(attributes.map?.type).toBe('map')
    expect((attributes.map as MapAttribute).attributes.str?.type).toBe('string')
    expect((attributes.map as MapAttribute).attributes.num?.type).toBe('number')

    expect(attributes.record).toBeInstanceOf(RecordAttribute)
    expect(attributes.record?.type).toBe('record')
    expect((attributes.record as RecordAttribute).keys.type).toBe('string')
    expect((attributes.record as RecordAttribute).keys.enum).toStrictEqual(['a', 'b', 'c'])
    expect((attributes.record as RecordAttribute).elements.type).toBe('string')

    expect(attributes.anyOf).toBeInstanceOf(AnyOfAttribute)
    expect(attributes.anyOf?.type).toBe('anyOf')
    expect((attributes.anyOf as AnyOfAttribute).elements).toHaveLength(2)
    expect((attributes.anyOf as AnyOfAttribute).elements[0]?.type).toBe('string')
    expect((attributes.anyOf as AnyOfAttribute).elements[1]?.type).toBe('null')
  })
})
