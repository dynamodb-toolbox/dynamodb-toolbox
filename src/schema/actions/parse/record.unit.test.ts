import { record, string } from '~/attributes/index.js'
import { DynamoDBToolboxError } from '~/errors/index.js'

import * as attrParserModule from './attribute.js'
import { recordAttributeParser } from './record.js'

// @ts-ignore
const attrParser = vi.spyOn(attrParserModule, 'attrParser')

const recordAttr = record(string(), string()).freeze('path')

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
    const options = { some: 'options' }
    const parser = recordAttributeParser(
      recordAttr,
      { foo: 'foo1', bar: 'bar1' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    const defaultedState = parser.next()
    expect(defaultedState.done).toBe(false)
    expect(defaultedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    expect(attrParser).toHaveBeenCalledTimes(4)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'foo', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.keys, 'bar', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'foo1', options)
    expect(attrParser).toHaveBeenCalledWith(recordAttr.elements, 'bar1', options)

    const linkedState = parser.next()
    expect(linkedState.done).toBe(false)
    expect(linkedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const parsedState = parser.next()
    expect(parsedState.done).toBe(false)
    expect(parsedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })

    const transformedState = parser.next()
    expect(transformedState.done).toBe(true)
    expect(transformedState.value).toStrictEqual({ foo: 'foo1', bar: 'bar1' })
  })

  test('ignores undefined values', () => {
    const recordA = record(string(), string()).freeze('root')

    const { value: parsed } = recordAttributeParser(
      recordA,
      { foo: 'bar', baz: undefined },
      { fill: false }
    ).next()
    expect(parsed).toStrictEqual({ foo: 'bar' })
  })

  test('applies validation if any', () => {
    const recordA = record(string(), string())
      .validate(input => 'foo' in input)
      .freeze('root')

    const { value: parsed } = recordAttributeParser(recordA, { foo: 'bar' }, { fill: false }).next()
    expect(parsed).toStrictEqual({ foo: 'bar' })

    const invalidCallA = () =>
      recordAttributeParser(recordA, { bar: 'foo' }, { fill: false }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const recordB = record(string(), string())
      .validate(input => ('foo' in input ? true : 'Oh no...'))
      .freeze('root')

    const invalidCallB = () =>
      recordAttributeParser(recordB, { bar: 'foo' }, { fill: false }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })
})
