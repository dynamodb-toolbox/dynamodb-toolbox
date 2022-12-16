import { filterUndefinedValues } from './filterUndefinedValues'
import {
  arrayWithObjectsWithUndefinedValues,
  expectedFilteredTuple,
  expectedFilteredObject,
  objectWithUndefinedValues
} from './filterUndefinedValues.fixtures.test'

describe('filterUndefinedValues', () => {
  it('does not impact primitives', () => {
    expect(filterUndefinedValues(4)).toStrictEqual(4)
  })

  it('recursively filters undefined values from object', () => {
    expect(filterUndefinedValues(objectWithUndefinedValues)).toStrictEqual(expectedFilteredObject)
  })

  it('does not modify object if it only has defined values', () => {
    expect(filterUndefinedValues(expectedFilteredObject)).toStrictEqual(expectedFilteredObject)
  })

  it('recursively filters undefined values from object in array', () => {
    expect(filterUndefinedValues(arrayWithObjectsWithUndefinedValues)).toStrictEqual(
      expectedFilteredTuple
    )
  })

  it('does not modify array if it only has defined values', () => {
    expect(filterUndefinedValues(expectedFilteredTuple)).toStrictEqual(expectedFilteredTuple)
  })
})
