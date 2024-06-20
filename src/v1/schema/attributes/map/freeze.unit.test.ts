import { DynamoDBToolboxError } from 'v1/errors/index.js'

import { string } from '../primitive/index.js'
import { validateAttributeProperties } from '../shared/validate.js'

import { map } from './typer.js'
import { $attributes } from '../constants/index.js'

jest.mock('../shared/validate', () => ({
  ...jest.requireActual<Record<string, unknown>>('../shared/validate'),
  validateAttributeProperties: jest.fn()
}))

const validateAttributePropertiesMock = validateAttributeProperties as jest.MockedFunction<
  typeof validateAttributeProperties
>

describe('map properties freeze', () => {
  const pathMock = 'some.path'

  const stringAttr = string()
  const string1Name = 'string1'
  const string2Name = 'string2'
  const mapInstance = map({ [string1Name]: stringAttr, [string2Name]: stringAttr })

  beforeEach(() => {
    validateAttributePropertiesMock.mockClear()
  })

  it('applies validateAttributeProperties on mapInstance', () => {
    mapInstance.freeze(pathMock)

    // Once + 2 attributes
    expect(validateAttributePropertiesMock).toHaveBeenCalledTimes(3)
  })

  it('applies freezeAttribute on attributes', () => {
    mapInstance[$attributes][string1Name].freeze = jest.fn(
      mapInstance[$attributes][string1Name].freeze
    )
    mapInstance[$attributes][string2Name].freeze = jest.fn(
      mapInstance[$attributes][string2Name].freeze
    )
    mapInstance.freeze(pathMock)

    expect(mapInstance[$attributes][string1Name].freeze).toHaveBeenCalledWith(
      [pathMock, string1Name].join('.')
    )
    expect(mapInstance[$attributes][string2Name].freeze).toHaveBeenCalledWith(
      [pathMock, string2Name].join('.')
    )
  })

  it('throws if map attribute has duplicate savedAs', () => {
    const invalidCallA = () => map({ a: stringAttr, b: stringAttr.savedAs('a') }).freeze(pathMock)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )

    const invalidCallB = () =>
      map({ a: stringAttr.savedAs('c'), b: stringAttr.savedAs('c') }).freeze(pathMock)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )
  })
})
