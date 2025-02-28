import { item, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { schemaParser } from './schema.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const sch = item({ foo: string(), bar: string() })

describe('schemaParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not an object', () => {
    const invalidCall = () => schemaParser(sch, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidItem' }))
  })

  test('applies attrParser on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parser = schemaParser(
      sch,
      { foo: 'foo', bar: 'bar' },
      // @ts-ignore we don't really care about the type here
      options
    )

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo', bar: 'bar' })

    expect(attrParser).toHaveBeenCalledTimes(2)
    expect(attrParser).toHaveBeenCalledWith(sch.attributes.foo, 'foo', {
      ...options,
      valuePath: ['foo'],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(sch.attributes.bar, 'bar', {
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
