import { DynamoDBToolboxError } from '~/errors/index.js'
import { list, string } from '~/schema/index.js'

import * as schemaFormatterModule from './schema.js'
import { listSchemaFormatter } from './list.js'

// @ts-ignore
const schemaFormatter = vi.spyOn(schemaFormatterModule, 'schemaFormatter')

const listSchema = list(string())

describe('listSchemaFormatter', () => {
  beforeEach(() => {
    schemaFormatter.mockClear()
  })

  test('throws an error if value is not a list', () => {
    const invalidCall = () => listSchemaFormatter(listSchema, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies schemaFormatter on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = listSchemaFormatter(listSchema, ['foo', 'bar'], options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual(['foo', 'bar'])

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(listSchema.elements, 'foo', {
      ...options,
      valuePath: ['root', 0]
    })
    expect(schemaFormatter).toHaveBeenCalledWith(listSchema.elements, 'bar', {
      ...options,
      valuePath: ['root', 1]
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 'bar'])
  })

  test('does not transform if transform is false', () => {
    const options = { transform: false }
    const formatter = listSchemaFormatter(listSchema, ['foo', 'bar'], options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 'bar'])

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(listSchema.elements, 'foo', {
      ...options,
      valuePath: [0]
    })
    expect(schemaFormatter).toHaveBeenCalledWith(listSchema.elements, 'bar', {
      ...options,
      valuePath: [1]
    })
  })

  // TODO: Apply validation
})
