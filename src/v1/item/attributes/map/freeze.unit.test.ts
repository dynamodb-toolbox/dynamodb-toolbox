import { DynamoDBToolboxError } from 'v1/errors'

import { string } from '../primitive'
import { validateAttributeProperties } from '../shared/validate'
import * as freezeAttributeModule from '../freeze'

import { freezeMapAttribute } from './freeze'
import { map } from './typer'

jest.mock('../shared/validate', () => ({
  ...jest.requireActual<Record<string, unknown>>('../shared/validate'),
  validateAttributeProperties: jest.fn()
}))

const validateAttributePropertiesMock = validateAttributeProperties as jest.MockedFunction<
  typeof validateAttributeProperties
>

// We have to do a module mock here: requireActual doesn't work due to circular dependency with freezeMap
// @ts-ignore
const freezeAttributeMock = jest
  .spyOn(freezeAttributeModule, 'freezeAttribute')
  .mockImplementation()

describe('map properties freeze', () => {
  const pathMock = 'some.path'

  const stringAttr = string()
  const string1Name = 'string1'
  const string2Name = 'string2'
  const mapInstance = map({ [string1Name]: stringAttr, [string2Name]: stringAttr })

  beforeEach(() => {
    validateAttributePropertiesMock.mockClear()
    freezeAttributeMock.mockClear()
  })

  it('applies validateAttributeProperties on mapInstance', () => {
    freezeMapAttribute(mapInstance, pathMock)

    expect(validateAttributePropertiesMock).toHaveBeenCalledTimes(1)
    expect(validateAttributePropertiesMock).toHaveBeenCalledWith(mapInstance, pathMock)
  })

  it('applies freezeAttribute on attributes', () => {
    freezeMapAttribute(mapInstance, pathMock)

    expect(freezeAttributeMock).toHaveBeenCalledTimes(2)
    expect(freezeAttributeMock).toHaveBeenCalledWith(stringAttr, [pathMock, string1Name].join('.'))
    expect(freezeAttributeMock).toHaveBeenCalledWith(stringAttr, [pathMock, string2Name].join('.'))
  })

  it('throws if map attribute has duplicate savedAs', () => {
    const invalidCallA = () =>
      freezeMapAttribute(map({ a: stringAttr, b: stringAttr.savedAs('a') }), pathMock)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'item.mapAttribute.duplicateSavedAs', path: pathMock })
    )

    const invalidCallB = () =>
      freezeMapAttribute(map({ a: stringAttr.savedAs('c'), b: stringAttr.savedAs('c') }), pathMock)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'item.mapAttribute.duplicateSavedAs', path: pathMock })
    )
  })
})
