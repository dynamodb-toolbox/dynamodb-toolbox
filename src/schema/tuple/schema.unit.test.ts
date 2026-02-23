import type { MockedFunction } from 'vitest'

import { string } from '../string/index.js'
import { checkSchemaProps } from '../utils/checkSchemaProps.js'
import { tuple } from './schema_.js'

vi.mock('../utils/checkSchemaProps', () => ({
  ...vi.importActual<Record<string, unknown>>('../utils/checkSchemaProps'),
  checkSchemaProps: vi.fn()
}))

const checkSchemaPropsMock = checkSchemaProps as MockedFunction<typeof checkSchemaProps>

describe('map properties check', () => {
  const pathMock = 'some.path'

  beforeEach(() => {
    checkSchemaPropsMock.mockClear()
  })

  test('applies checkSchemaProps on tupleInstance', () => {
    tuple(string(), string()).check()

    // Once + 2 attributes
    expect(checkSchemaPropsMock).toHaveBeenCalledTimes(3)
  })

  test('applies .check on attributes', () => {
    const string1Attr = string()
    const string2Attr = string()
    const tupleInstance = tuple(string1Attr, string2Attr)

    tupleInstance.elements[0].check = vi.fn(tupleInstance.elements[0].check)
    tupleInstance.elements[1].check = vi.fn(tupleInstance.elements[1].check)
    tupleInstance.check(pathMock)

    expect(tupleInstance.elements[0].check).toHaveBeenCalledWith(`${pathMock}[0]`)
    expect(tupleInstance.elements[1].check).toHaveBeenCalledWith(`${pathMock}[1]`)
  })
})
