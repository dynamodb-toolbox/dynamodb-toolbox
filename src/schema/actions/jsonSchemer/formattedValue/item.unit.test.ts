import type { A } from 'ts-toolbelt'

import {
  any,
  anyOf,
  boolean,
  item,
  list,
  map,
  nul,
  number,
  record,
  set,
  string,
  tuple
} from '~/schema/index.js'

import { JSONSchemer } from '../jsonSchemer.js'

describe('jsonSchemer - formattedItem', () => {
  test('builds correct json schemas', () => {
    const mySchema = item({
      hidden: string().hidden(),
      optional: string().optional(),
      any: any(),
      boolean: boolean(),
      number: number(),
      string: string(),
      binary: string(),
      set: set(string()),
      list: list(string()),
      map: map({
        str: string(),
        num: number()
      }),
      record: record(string(), string()),
      tuple: tuple(string(), number()),
      anyOf: anyOf(nul(), string())
    }).meta({ title: 'Title', description: 'Desc', examples: ['ex'], custom: 'prop' })

    const JSONSchema = mySchema.build(JSONSchemer).formattedValueSchema()

    type ExpectedJSONSchema = {
      title: 'Title'
      description: 'Desc'
      examples: string[]
      type: 'object'
      properties: {
        string: { type: 'string' }
        number: { type: 'number' }
        boolean: { type: 'boolean' }
        any: {}
        binary: { type: 'string' }
        optional: { type: 'string' }
        set: {
          type: 'array'
          items: { type: 'string' }
          uniqueItems: true
        }
        list: {
          type: 'array'
          items: { type: 'string' }
        }
        map: {
          type: 'object'
          properties: {
            str: { type: 'string' }
            num: { type: 'number' }
          }
          required: ('str' | 'num')[]
        }
        record: {
          type: 'object'
          propertyNames: { type: 'string' }
          additionalProperties: { type: 'string' }
        }
        tuple: {
          type: 'array'
          items: [{ type: 'string' }, { type: 'number' }]
          minItems: 2
          maxItems: 2
        }
        anyOf: { anyOf: [{ type: 'null' }, { type: 'string' }] }
      }
      required: (
        | 'string'
        | 'number'
        | 'boolean'
        | 'any'
        | 'binary'
        | 'set'
        | 'list'
        | 'map'
        | 'record'
        | 'tuple'
        | 'anyOf'
      )[]
    }

    const expectedJSONSchema: ExpectedJSONSchema = {
      title: 'Title',
      description: 'Desc',
      examples: ['ex'],
      type: 'object',
      properties: {
        string: { type: 'string' },
        number: { type: 'number' },
        boolean: { type: 'boolean' },
        any: {},
        binary: { type: 'string' },
        optional: { type: 'string' },
        set: {
          type: 'array',
          items: { type: 'string' },
          uniqueItems: true
        },
        list: {
          type: 'array',
          items: { type: 'string' }
        },
        map: {
          type: 'object',
          properties: {
            str: { type: 'string' },
            num: { type: 'number' }
          },
          required: ['str', 'num']
        },
        record: {
          type: 'object',
          propertyNames: { type: 'string' },
          additionalProperties: { type: 'string' }
        },
        tuple: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
          minItems: 2,
          maxItems: 2
        },
        anyOf: { anyOf: [{ type: 'null' }, { type: 'string' }] }
      },
      required: [
        'any',
        'boolean',
        'number',
        'string',
        'binary',
        'set',
        'list',
        'map',
        'record',
        'tuple',
        'anyOf'
      ]
    }

    const assertJSONSchema: A.Equals<typeof JSONSchema, ExpectedJSONSchema> = 1
    assertJSONSchema

    expect(JSONSchema).toStrictEqual(expectedJSONSchema)
  })

  test('builds correct json schemas for strict schemas', () => {
    const mySchema = item({
      map: map({ str: string() }).strict(),
      tuple: tuple(string(), number()).strict()
    }).strict()

    const JSONSchema = mySchema.build(JSONSchemer).formattedValueSchema()

    type ExpectedJSONSchema = {
      type: 'object'
      properties: {
        map: {
          type: 'object'
          properties: { str: { type: 'string' } }
          required: 'str'[]
          additionalProperties: false
        }
        tuple: {
          type: 'array'
          items: [{ type: 'string' }, { type: 'number' }]
          minItems: 2
          maxItems: 2
        }
      }
      required: ('map' | 'tuple')[]
      additionalProperties: false
    }

    const expectedJSONSchema: ExpectedJSONSchema = {
      type: 'object',
      properties: {
        map: {
          type: 'object',
          properties: { str: { type: 'string' } },
          required: ['str'],
          additionalProperties: false
        },
        tuple: {
          type: 'array',
          items: [{ type: 'string' }, { type: 'number' }],
          minItems: 2,
          maxItems: 2
        }
      },
      required: ['map', 'tuple'],
      additionalProperties: false
    }

    const assertJSONSchema: A.Equals<typeof JSONSchema, ExpectedJSONSchema> = 1
    assertJSONSchema

    expect(JSONSchema).toStrictEqual(expectedJSONSchema)
  })
})
