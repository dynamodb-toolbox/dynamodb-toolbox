import type { MockedFunction } from 'vitest'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkAttributeProperties } from '../shared/check.js'
import { string } from '../string/index.js'
import { map } from './schema_.js'

vi.mock('../shared/check', () => ({
  ...vi.importActual<Record<string, unknown>>('../shared/check'),
  checkAttributeProperties: vi.fn()
}))

const validateAttributePropertiesMock = checkAttributeProperties as MockedFunction<
  typeof checkAttributeProperties
>

describe('map properties check', () => {
  const pathMock = 'some.path'

  const stringAttr = string()
  const string1Name = 'string1'
  const string2Name = 'string2'
  const mapInstance = map({ [string1Name]: stringAttr, [string2Name]: stringAttr })

  beforeEach(() => {
    validateAttributePropertiesMock.mockClear()
  })

  test('applies checkAttributeProperties on mapInstance', () => {
    mapInstance.check(pathMock)

    // Once + 2 attributes
    expect(validateAttributePropertiesMock).toHaveBeenCalledTimes(3)
  })

  test('applies freezeAttribute on attributes', () => {
    mapInstance.attributes[string1Name].check = vi.fn(mapInstance.attributes[string1Name].check)
    mapInstance.attributes[string2Name].check = vi.fn(mapInstance.attributes[string2Name].check)
    mapInstance.check(pathMock)

    expect(mapInstance.attributes[string1Name].check).toHaveBeenCalledWith(
      [pathMock, string1Name].join('.')
    )
    expect(mapInstance.attributes[string2Name].check).toHaveBeenCalledWith(
      [pathMock, string2Name].join('.')
    )
  })

  test('throws if map attribute has duplicate savedAs', () => {
    const invalidCallA = () => map({ a: stringAttr, b: stringAttr.savedAs('a') }).check(pathMock)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )

    const invalidCallB = () =>
      map({ a: stringAttr.savedAs('c'), b: stringAttr.savedAs('c') }).check(pathMock)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )
  })
})
