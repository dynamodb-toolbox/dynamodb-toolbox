import {
  AnySchema,
  any,
  anyOf,
  binary,
  boolean,
  item,
  list,
  map,
  nul,
  number,
  record,
  set,
  string
} from '~/schema/index.js'
import { prefix } from '~/transformers/prefix.js'

import { getPathSchemas } from './getPathSchemas.js'
import { Path } from './path.js'

describe('getPathSchemas', () => {
  describe('empty path', () => {
    test('returns original schema if path is empty', () => {
      const schema = string()

      expect(getPathSchemas(schema, [])).toStrictEqual([{ path: Path.fromArray([]), schema }])
    })
  })

  describe('any', () => {
    test('returns a new Any schema', () => {
      const anySchema = any().required('always')

      expect(getPathSchemas(anySchema, ['foo'])).toStrictEqual([
        {
          path: Path.fromArray(['foo']),
          schema: expect.objectContaining(new AnySchema({ required: 'never' }))
        }
      ])
    })
  })

  describe('primitives & sets', () => {
    test('returns nothing', () => {
      const nullSchema = nul()
      const booleanSchema = boolean()
      const numberSchema = number()
      const strSchema = string()
      const binSchema = binary()
      const setSchema = set(string())

      expect(getPathSchemas(nullSchema, ['foo'])).toStrictEqual([])
      expect(getPathSchemas(booleanSchema, ['foo'])).toStrictEqual([])
      expect(getPathSchemas(numberSchema, ['foo'])).toStrictEqual([])
      expect(getPathSchemas(strSchema, ['foo'])).toStrictEqual([])
      expect(getPathSchemas(binSchema, ['foo'])).toStrictEqual([])
      expect(getPathSchemas(setSchema, ['foo'])).toStrictEqual([])
    })
  })

  describe('items & maps', () => {
    const strSchema = string().savedAs('_s')
    const escapedStrSchema = string().savedAs('.[escaped')

    const schemaWithSavedAs = item({
      savedAs: strSchema,
      ['escaped.[']: escapedStrSchema,
      deep: map({ savedAs: strSchema }).savedAs('_n'),
      listed: list(map({ savedAs: strSchema })).savedAs('_l')
    })

    test('returns nothing if path does not match', () => {
      expect(getPathSchemas(schemaWithSavedAs, ['foo'])).toStrictEqual([])
    })

    test('correctly find schema & transformed path (root)', () => {
      expect(getPathSchemas(schemaWithSavedAs, ['savedAs'])).toStrictEqual([
        { path: Path.fromArray(['_s']), schema: strSchema }
      ])
    })

    test('correctly find schema & transformed path (root + escaped string)', () => {
      expect(getPathSchemas(schemaWithSavedAs, ['escaped.['])).toStrictEqual([
        { path: Path.fromArray(['.[escaped']), schema: escapedStrSchema }
      ])
    })

    test('correctly find schema & transformed path (deep)', () => {
      expect(getPathSchemas(schemaWithSavedAs, ['deep', 'savedAs'])).toStrictEqual([
        { path: Path.fromArray(['_n', '_s']), schema: strSchema }
      ])
    })

    test('correctly find schema & transformed path (deep within list)', () => {
      expect(getPathSchemas(schemaWithSavedAs, ['listed', 4, 'savedAs'])).toStrictEqual([
        { path: Path.fromArray(['_l', 4, '_s']), schema: strSchema }
      ])
    })
  })
})

describe('records', () => {
  const keySchema = string().transform(prefix('_', { delimiter: '' }))
  const valueSchema = number().savedAs('_v')
  const recordSchema = record(keySchema, list(map({ value: valueSchema }))).savedAs('_r')

  const schema = item({
    record: record(keySchema, list(map({ value: valueSchema }))).savedAs('_r')
  })

  test('correctly find schema & transformed path (root)', () => {
    expect(getPathSchemas(schema, ['record'])).toStrictEqual([
      { path: Path.fromArray(['_r']), schema: recordSchema }
    ])
  })

  test('correctly find schema & transformed path (deep)', () => {
    expect(getPathSchemas(schema, ['record', 'key', 2, 'value'])).toStrictEqual([
      { path: Path.fromArray(['_r', '_key', 2, '_v']), schema: valueSchema }
    ])
  })
})

describe('anyOf', () => {
  const strOrNumSchema = anyOf(string(), number())
  const anyOfAttrSchema = anyOf(number(), map({ strOrNum: strOrNumSchema }))

  const schemaWithAnyOf = item({ anyOf: anyOfAttrSchema })

  test('correctly find schema & transformed path (root)', () => {
    expect(getPathSchemas(schemaWithAnyOf, ['anyOf'])).toStrictEqual([
      { path: Path.fromArray(['anyOf']), schema: anyOfAttrSchema }
    ])
  })

  test('correctly find schema & transformed path (deep num)', () => {
    expect(getPathSchemas(schemaWithAnyOf, ['anyOf', 'strOrNum'])).toStrictEqual([
      { path: Path.fromArray(['anyOf', 'strOrNum']), schema: strOrNumSchema }
    ])
  })

  test('correctly find schemas & transformed paths (deep str)', () => {
    const statusSchemaA = string().enum('a')
    const statusSchemaB = string().enum('b').savedAs('_st')

    const deepAnyOf = item({
      anyOf: anyOf(map({ status: statusSchemaA }), map({ status: statusSchemaB }))
    })

    expect(getPathSchemas(deepAnyOf, ['anyOf', 'status'])).toStrictEqual([
      { path: Path.fromArray(['anyOf', 'status']), schema: statusSchemaA },
      { path: Path.fromArray(['anyOf', '_st']), schema: statusSchemaB }
    ])
  })
})
