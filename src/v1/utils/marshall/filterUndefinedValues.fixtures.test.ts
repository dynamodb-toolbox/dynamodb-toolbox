// PRIMITIVE

export type Primitive = number | string | boolean | null

// OBJECT

export type ObjectWithUndefinedValues = {
  a: undefined
  b: string
  c: { d: undefined; e: string }
}

export const objectWithUndefinedValues: ObjectWithUndefinedValues = {
  a: undefined,
  b: 'foo',
  c: { d: undefined, e: 'bar' }
}

export type ExpectedFilteredObject = {
  b: string
  c: { e: string }
}

export const expectedFilteredObject: ExpectedFilteredObject = {
  b: 'foo',
  c: { e: 'bar' }
}

// TUPLE

export type TupleWithObjectsWithUndefinedValues = [
  ExpectedFilteredObject,
  ObjectWithUndefinedValues
]

export const arrayWithObjectsWithUndefinedValues: TupleWithObjectsWithUndefinedValues = [
  expectedFilteredObject,
  objectWithUndefinedValues
]

export type ExpectedFilteredTuple = [ExpectedFilteredObject, ExpectedFilteredObject]

export const expectedFilteredTuple: ExpectedFilteredTuple = [
  expectedFilteredObject,
  expectedFilteredObject
]

// ARRAY

export type ArrayWithObjectsWithUndefinedValues = ObjectWithUndefinedValues[]

export type ExpectedFilteredArray = ExpectedFilteredObject[]
