import type { A } from 'ts-toolbelt'

import { FilterUndefinedValues, filterUndefinedValues } from './filterUndefinedValues'
import {
  Primitive,
  ExpectedFilteredObject,
  objectWithUndefinedValues,
  ObjectWithUndefinedValues,
  TupleWithObjectsWithUndefinedValues,
  ExpectedFilteredTuple,
  arrayWithObjectsWithUndefinedValues,
  ArrayWithObjectsWithUndefinedValues,
  ExpectedFilteredArray
} from './filterUndefinedValues.fixtures.test'

// PRIMITIVE

const assertFilteredPrimitive: A.Equals<FilterUndefinedValues<Primitive>, Primitive> = 1
assertFilteredPrimitive

// OBJECT

const assertFilteredObject: A.Equals<
  FilterUndefinedValues<ObjectWithUndefinedValues>,
  ExpectedFilteredObject
> = 1
assertFilteredObject

const filteredObject = filterUndefinedValues(objectWithUndefinedValues)
const assertFilteredObjectFromFn: A.Equals<typeof filteredObject, ExpectedFilteredObject> = 1
assertFilteredObjectFromFn

// TUPLE

/**
 * @debt type "A.Equals doesn't work with tuples"
 */
const assertFilteredTuple1: A.Equals<
  FilterUndefinedValues<TupleWithObjectsWithUndefinedValues>[0],
  ExpectedFilteredTuple[0]
> = 1
assertFilteredTuple1

const assertFilteredTuple2: A.Equals<
  FilterUndefinedValues<TupleWithObjectsWithUndefinedValues>[1],
  ExpectedFilteredTuple[1]
> = 1
assertFilteredTuple2

const filteredTuple = filterUndefinedValues(arrayWithObjectsWithUndefinedValues)
const assertFilteredTupleFromFn1: A.Equals<typeof filteredTuple[0], ExpectedFilteredTuple[0]> = 1
assertFilteredTupleFromFn1
const assertFilteredTupleFromFn2: A.Equals<typeof filteredTuple[1], ExpectedFilteredTuple[1]> = 1
assertFilteredTupleFromFn2

// ARRAY

const assertFilteredArray: A.Equals<
  FilterUndefinedValues<ArrayWithObjectsWithUndefinedValues>,
  ExpectedFilteredArray
> = 1
assertFilteredArray
