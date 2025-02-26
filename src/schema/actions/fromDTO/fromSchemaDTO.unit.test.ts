import {
  AnyOfSchema,
  BinarySchema,
  BooleanSchema,
  ListSchema,
  MapSchema,
  NullSchema,
  NumberSchema,
  RecordSchema,
  SetSchema,
  StringSchema
} from '~/attributes/index.js'
import type { ISchemaDTO } from '~/schema/actions/dto/index.js'
import { Schema } from '~/schema/index.js'

import { fromSchemaDTO } from './fromSchemaDTO.js'

describe('fromDTO - schema', () => {
  test('creates correct schema', () => {
    const schemaDTO: ISchemaDTO = {
      type: 'schema',
      attributes: {
        null: { type: 'null' },
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

    const importedSchema = fromSchemaDTO(schemaDTO)

    expect(importedSchema).toBeInstanceOf(Schema)

    const { attributes } = importedSchema

    expect(attributes.null).toBeInstanceOf(NullSchema)

    expect(attributes.boolean).toBeInstanceOf(BooleanSchema)
    const boolean = attributes.boolean as BooleanSchema
    expect(boolean.props.key).toBe(true)

    expect(attributes.number).toBeInstanceOf(NumberSchema)
    const number = attributes.number as NumberSchema
    expect(number.props.enum).toStrictEqual([0, 1, 2])

    expect(attributes.str).toBeInstanceOf(StringSchema)
    const str = attributes.str as StringSchema
    expect(str.props.required).toBe('always')

    expect(attributes.binary).toBeInstanceOf(BinarySchema)
    const binary = attributes.binary as BinarySchema
    expect(binary.props.savedAs).toBe('_b')
    expect(binary.props.enum).toStrictEqual([new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6])])

    expect(attributes.set).toBeInstanceOf(SetSchema)
    const set = attributes.set as SetSchema
    expect(set.elements.type).toBe('string')

    expect(attributes.list).toBeInstanceOf(ListSchema)
    const list = attributes.list as ListSchema
    expect(list.elements.type).toBe('number')

    expect(attributes.map).toBeInstanceOf(MapSchema)
    const map = attributes.map as MapSchema
    expect(map.attributes.str?.type).toBe('string')
    expect(map.attributes.num?.type).toBe('number')

    expect(attributes.record).toBeInstanceOf(RecordSchema)
    const record = attributes.record as RecordSchema
    expect(record.keys.type).toBe('string')
    expect(record.keys.props.enum).toStrictEqual(['a', 'b', 'c'])
    expect(record.elements.type).toBe('string')

    expect(attributes.anyOf).toBeInstanceOf(AnyOfSchema)
    const anyOf = attributes.anyOf as AnyOfSchema
    expect(anyOf.elements).toHaveLength(2)
    expect(anyOf.elements[0]?.type).toBe('string')
    expect(anyOf.elements[1]?.type).toBe('null')
  })
})
