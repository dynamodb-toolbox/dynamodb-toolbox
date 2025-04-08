import { DynamoDBToolboxError } from '~/errors/index.js'
import { item, string } from '~/schema/index.js'

import * as schemaParserModule from './schema.js'
import { itemParser } from './item.js'

// @ts-ignore
const schemaParser = vi.spyOn(schemaParserModule, 'schemaParser')

const sch = item({ foo: string(), bar: string() })

describe('itemParser', () => {
  beforeEach(() => {
    schemaParser.mockClear()
  })

  test('throws an error if input is not an object', () => {
    const invalidCall = () => itemParser(sch, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidItem' }))
  })

  test('applies schemaParser on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = itemParser(
      sch,
      { foo: 'foo', bar: 'bar' },
      // @ts-ignore we don't really care about the type here
      options
    )

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(schemaParser).toHaveBeenCalledTimes(2)
    expect(schemaParser).toHaveBeenCalledWith(sch.attributes.foo, 'foo', {
      ...options,
      valuePath: ['foo'],
      defined: false
    })
    expect(schemaParser).toHaveBeenCalledWith(sch.attributes.bar, 'bar', {
      ...options,
      valuePath: ['bar'],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })
  })
})
