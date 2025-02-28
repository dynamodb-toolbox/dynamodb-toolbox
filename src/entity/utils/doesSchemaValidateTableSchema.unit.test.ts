import { item, number, string } from '~/index.js'

import { doesSchemaValidateTableSchemaKey } from './doesSchemaValidateTableSchema.js'

describe('doesSchemaValidateTableSchema', () => {
  test('returns false if schema matches key attribute', () => {
    expect(
      doesSchemaValidateTableSchemaKey(item({ pk: string().key() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(true)
  })

  test('returns true if attribute is savedAs correctly', () => {
    expect(
      doesSchemaValidateTableSchemaKey(
        item({
          partitionKey: string().key().savedAs('pk')
        }),
        { name: 'pk', type: 'string' }
      )
    ).toBe(true)
  })

  test('returns false if attribute is savedAs incorrectly', () => {
    expect(
      doesSchemaValidateTableSchemaKey(
        item({
          pk: string().key().savedAs('partitionKey')
        }),
        { name: 'pk', type: 'string' }
      )
    ).toBe(false)
  })

  test('returns false if attribute is not always required', () => {
    expect(
      doesSchemaValidateTableSchemaKey(item({ pk: string().key().optional() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(false)
  })

  test('returns true if attribute is not always required but has default', () => {
    expect(
      doesSchemaValidateTableSchemaKey(item({ pk: string().key().optional().default('foo') }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(true)
  })

  test('returns false if types do not match', () => {
    expect(
      doesSchemaValidateTableSchemaKey(item({ pk: number().key() }), {
        name: 'pk',
        type: 'string'
      })
    ).toBe(false)
  })
})
