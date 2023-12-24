import { DynamoDBToolboxError } from 'v1/errors'
import { $savedAs, $transform, freezeMapAttribute, map, string } from 'v1/schema'
import { prefix } from 'v1/transformers'

import { parseMapAttributeClonedInput } from './map'
import * as parseAttributeClonedInputModule from './attribute'

const parseAttributeClonedInputMock = jest
  .spyOn(parseAttributeClonedInputModule, 'parseAttributeClonedInput')
  // @ts-expect-error
  .mockImplementation((_, input) => input)

const mapAttr = freezeMapAttribute(map({ foo: string(), bar: string() }), 'path')

describe('parseMapAttributeClonedInput', () => {
  beforeEach(() => {
    parseAttributeClonedInputMock.mockClear()
  })

  it('throws an error if input is not a map', () => {
    const invalidCall = () => parseMapAttributeClonedInput(mapAttr, ['foo', 'bar'])

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'parsing.invalidAttributeInput' }))
  })

  it('applies parseAttributeClonesInput on input properties otherwise (and pass options)', () => {
    const options = { some: 'options' }
    const parsedValues = parseMapAttributeClonedInput(
      mapAttr,
      { foo: 'foo', bar: 'bar' },
      // @ts-expect-error we don't really care about the type here
      options
    )

    expect(parsedValues).toStrictEqual({ [$savedAs]: {}, foo: 'foo', bar: 'bar' })
    expect(parseAttributeClonedInputMock).toHaveBeenCalledTimes(2)
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(
      mapAttr.attributes.foo,
      'foo',
      options
    )
    expect(parseAttributeClonedInputMock).toHaveBeenCalledWith(
      mapAttr.attributes.bar,
      'bar',
      options
    )
  })

  it('keeps savedAs if one is present', () => {
    const mapAttr2 = freezeMapAttribute(map({ foo: string().savedAs('f'), bar: string() }), 'path')

    const parsedValues = parseMapAttributeClonedInput(mapAttr2, { foo: 'foo', bar: 'bar' })

    expect(parsedValues).toStrictEqual({
      [$savedAs]: { foo: 'f' },
      foo: 'foo',
      bar: 'bar'
    })
  })

  it('keeps transformer if one is present', () => {
    const transformer = prefix('foo')
    const mapAttr2 = freezeMapAttribute(
      map({ foo: string().transform(transformer), bar: string() }),
      'path'
    )

    const parsedValues = parseMapAttributeClonedInput(mapAttr2, { foo: 'foo', bar: 'bar' })

    expect(parsedValues).toStrictEqual({
      [$savedAs]: {},
      [$transform]: { foo: transformer },
      foo: 'foo',
      bar: 'bar'
    })
  })
})
