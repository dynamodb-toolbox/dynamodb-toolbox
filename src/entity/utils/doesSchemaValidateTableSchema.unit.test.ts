import { number, schema, string } from '~/index.js'

import { doesSchemaValidateTableSchemaKey } from './doesSchemaValidateTableSchema.js'

describe('doesSchemaValidateTableSchema', () => {
  test('returns false if schema matches key attribute', () => {
    expect(
      doesSchemaValidateTableSchemaKey(schema({ pk: string().key() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(true)
  })

  test('returns true if attribute is savedAs correctly', () => {
    expect(
      doesSchemaValidateTableSchemaKey(
        schema({
          partitionKey: string().key().savedAs('pk')
        }),
        { name: 'pk', type: 'string' }
      )
    ).toBe(true)
  })

  test('returns false if attribute is not always required', () => {
    expect(
      doesSchemaValidateTableSchemaKey(schema({ pk: string().key().optional() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(false)
  })

  test('returns true if attribute is not always required but has default', () => {
    expect(
      doesSchemaValidateTableSchemaKey(schema({ pk: string().key().optional().default('foo') }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(true)
  })

  test('returns false if types do not match', () => {
    expect(
      doesSchemaValidateTableSchemaKey(schema({ pk: number().key() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(false)
  })
})
