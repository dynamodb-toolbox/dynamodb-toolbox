import { record, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { recordAttributeParser } from './record.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const recordAttr = record(string(), string())

describe('recordAttributeParser', () => {
  beforeEach(() => {
    attrParser.mockClear()
  })

  test('throws an error if input is not a record', () => {
    const invalidCall = () =>
      recordAttributeParser(recordAttr, ['foo', 'bar'], { fill: false }).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  test('applies attrParser on input properties otherwise (and pass options)', () => {
    const options = { valuePath: ['root'] }
    const parser = recordAttributeParser(recordAttr, { foo: 'foo1', bar: 'bar1' }, options)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    expect(attrParser).toHaveBeenCalledTimes(4)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'foo', {
      ...options,
      valuePath: ['root', 'foo']
    })
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'bar', {
      ...options,
      valuePath: ['root', 'bar']
    })
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'foo1', {
      ...options,
      valuePath: ['root', 'foo'],
      defined: false
    })
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'bar1', {
      ...options,
      valuePath: ['root', 'bar'],
      defined: false
    })

    const { value: linkedValue } = parser.next()
    expect(linkedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const { value: parsedValue } = parser.next()
    expect(parsedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const { done, value: transformedValue } = parser.next()
    expect(done).toBe(true)
    expect(transformedValue).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
  })

  test('ignores undefined values', () => {
    const recordA = record(string(), string())

    const { value: parsedValue } = recordAttributeParser(
      recordA,
      { foo: 'bar', baz: undefined },
      { fill: false }
    ).next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })
  })

  test('applies validation if any', () => {
    const recordA = record(string(), string()).validate(input => 'foo' in input)

    const { value: parsedValue } = recordAttributeParser(
      recordA,
      { foo: 'bar' },
      { fill: false }
    ).next()
    expect(parsedValue).toStrictEqual({ foo: 'bar' })

    const invalidCallA = () =>
      recordAttributeParser(recordA, { bar: 'foo' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const recordB = record(string(), string()).validate(input =>
      'foo' in input ? true : 'Oh no...'
    )

    const invalidCallB = () =>
      recordAttributeParser(recordB, { bar: 'foo' }, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
