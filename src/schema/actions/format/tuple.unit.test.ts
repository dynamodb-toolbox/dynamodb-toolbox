import { DynamoDBToolboxError } from '~/errors/index.js'
import { number, string, tuple } from '~/schema/index.js'

import * as schemaFormatterModule from './schema.js'
import { tupleSchemaFormatter } from './tuple.js'

// @ts-ignore
const schemaFormatter = vi.spyOn(schemaFormatterModule, 'schemaFormatter')

const tupleSchema = tuple(string(), number())

describe('tupleSchemaFormatter', () => {
  beforeEach(() => {
    schemaFormatter.mockClear()
  })

  test('throws an error if value is not a tuple', () => {
    const invalidCall = () => tupleSchemaFormatter(tupleSchema, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies schemaFormatter on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = tupleSchemaFormatter(tupleSchema, ['foo', 42], options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual(['foo', 42])

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[0], 'foo', {
      ...options,
      valuePath: ['root', 0]
    })
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[1], 42, {
      ...options,
      valuePath: ['root', 1]
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 42])
  })

  test('skips element if not projected', () => {
    const options = { attributes: ['[1]'] }
    const formatter = tupleSchemaFormatter(tupleSchema, [42], options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual([42])

    expect(schemaFormatter).toHaveBeenCalledTimes(1)
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[1], 42, {
      ...options,
      valuePath: [1],
      attributes: undefined
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual([42])
  })

  test('allows incomplete tuple if partial is true', () => {
    const options = { partial: true }
    const formatter = tupleSchemaFormatter(tupleSchema, [undefined, 42], options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual([undefined, 42])

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[0], undefined, {
      ...options,
      valuePath: [0]
    })
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[1], 42, {
      ...options,
      valuePath: [1]
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual([undefined, 42])
  })

  test('does not transform if transform is false', () => {
    const options = { transform: false }
    const formatter = tupleSchemaFormatter(tupleSchema, ['foo', 42], options)

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(['foo', 42])

    expect(schemaFormatter).toHaveBeenCalledTimes(2)
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[0], 'foo', {
      ...options,
      valuePath: [0]
    })
    expect(schemaFormatter).toHaveBeenCalledWith(tupleSchema.elements[1], 42, {
      ...options,
      valuePath: [1]
    })
  })

  // TODO: Apply validation
})
