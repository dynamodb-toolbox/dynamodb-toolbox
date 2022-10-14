import { string } from '../leaf'
import { validateAttributeProperties } from '../shared/validate'
import * as validateAttributeModule from '../validate'

import { DuplicateSavedAsAttributesError, validateMapAttribute } from './validate'
import { map } from './typer'

jest.mock('../shared/validate', () => ({
  ...jest.requireActual<Record<string, unknown>>('../shared/validate'),
  validateAttributeProperties: jest.fn()
}))

const validateAttributePropertiesMock = validateAttributeProperties as jest.MockedFunction<
  typeof validateAttributeProperties
>

// We have to do a module mock here: requireActual doesn't work due to circular dependency with validateMap
const validateAttributeMock = jest
  .spyOn(validateAttributeModule, 'validateAttribute')
  .mockImplementation()

describe('map properties validation', () => {
  const pathMock = 'some/path'

  const stringAttr = string()
  const string1Name = 'string1'
  const string2Name = 'string2'
  const mapInstance = map({ [string1Name]: stringAttr, [string2Name]: stringAttr })

  beforeEach(() => {
    validateAttributePropertiesMock.mockClear()
    validateAttributeMock.mockClear()
  })

  it('applies validateAttributeProperties on mapInstance', () => {
    validateMapAttribute(mapInstance, pathMock)

    expect(validateAttributePropertiesMock).toHaveBeenCalledTimes(1)
    expect(validateAttributePropertiesMock).toHaveBeenCalledWith(mapInstance, pathMock)
  })

  it('applies validateAttribute on properties', () => {
    validateMapAttribute(mapInstance, pathMock)

    expect(validateAttributeMock).toHaveBeenCalledTimes(2)
    expect(validateAttributeMock).toHaveBeenCalledWith(
      stringAttr,
      // TODO Mock and use joinPaths util
      [pathMock, string1Name].join('.')
    )
    expect(validateAttributeMock).toHaveBeenCalledWith(
      stringAttr,
      // TODO Mock and use joinPaths util
      [pathMock, string2Name].join('.')
    )
  })

  it('throws if map attribute has duplicate savedAs', () => {
    expect(() =>
      validateMapAttribute(map({ a: stringAttr, b: stringAttr.savedAs('a') }), pathMock)
    ).toThrow(new DuplicateSavedAsAttributesError({ duplicatedSavedAs: 'a', path: pathMock }))

    expect(() =>
      validateMapAttribute(
        map({ a: stringAttr.savedAs('c'), b: stringAttr.savedAs('c') }),
        pathMock
      )
    ).toThrow(new DuplicateSavedAsAttributesError({ duplicatedSavedAs: 'c', path: pathMock }))
  })
})
