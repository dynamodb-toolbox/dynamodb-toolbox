import { DynamoDBToolboxError } from '~/errors/index.js'
import { set, string } from '~/schema/index.js'

import * as attrFormatterModule from './attribute.js'
import { setSchemaFormatter } from './set.js'

// @ts-ignore
const attrFormatter = vi.spyOn(attrFormatterModule, 'attrFormatter')

const schema = set(string())

describe('setSchemaFormatter', () => {
  beforeEach(() => {
    attrFormatter.mockClear()
  })

  test('throws an error if input is not a set', () => {
    const invalidCall = () => setSchemaFormatter(schema, { foo: 'bar' }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('applies attrFormatter on input elements otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const formatter = setSchemaFormatter(schema, new Set(['foo', 'bar']), options)

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toStrictEqual(new Set(['foo', 'bar']))

    expect(attrFormatter).toHaveBeenCalledTimes(2)
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, 'foo', {
      ...options,
      valuePath: ['root', 0]
    })
    expect(attrFormatter).toHaveBeenCalledWith(schema.elements, 'bar', {
      ...options,
      valuePath: ['root', 1]
    })

    const { done, value: formattedValue } = formatter.next()
    expect(done).toBe(true)
    expect(formattedValue).toStrictEqual(new Set(['foo', 'bar']))
  })

  // TODO: Apply validation
})
