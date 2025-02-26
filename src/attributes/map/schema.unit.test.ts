import type { MockedFunction } from 'vitest'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkSchemaProps } from '../shared/check.js'
import { string } from '../string/index.js'
import { map } from './schema_.js'

vi.mock('../shared/check', () => ({
  ...vi.importActual<Record<string, unknown>>('../shared/check'),
  checkSchemaProps: vi.fn()
}))

const checkSchemaPropsMock = checkSchemaProps as MockedFunction<typeof checkSchemaProps>

describe('map properties check', () => {
  const pathMock = 'some.path'

  beforeEach(() => {
    checkSchemaPropsMock.mockClear()
  })

  test('applies checkSchemaProps on mapInstance', () => {
    map({ string1: string(), string2: string() }).check()

    // Once + 2 attributes
    expect(checkSchemaPropsMock).toHaveBeenCalledTimes(3)
  })

  test('applies .check on attributes', () => {
    const string1Attr = string()
    const string2Attr = string()
    const string1Name = 'string1'
    const string2Name = 'string2'
    const mapInstance = map({ [string1Name]: string1Attr, [string2Name]: string2Attr })

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
    const invalidCallA = () => map({ a: string(), b: string().savedAs('a') }).check(pathMock)

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )

    const invalidCallB = () =>
      map({ a: string().savedAs('c'), b: string().savedAs('c') }).check(pathMock)

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({ code: 'schema.mapAttribute.duplicateSavedAs', path: pathMock })
    )
  })
})
