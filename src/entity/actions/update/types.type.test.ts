import type { A } from 'ts-toolbelt'

import { any } from '~/schema/index.js'

import type { UpdateValueInput } from './types.js'

interface MyNestedType {
  hello: string
}

// updateLink callbacks receive values that are defined and non-extended, so
// that is the mode these assertions pin.

// Regular: a bare any() accepts anything, so the callback value is unknown.
const regular = any()

const assertRegular: A.Equals<
  UpdateValueInput<typeof regular, { defined: true; extended: false }>,
  unknown
> = 1
assertRegular

// Cast: castAs<T> must resolve to T in the callback rather than widening back
// to unknown.
const cast = any().castAs<MyNestedType>()

const assertCast: A.Equals<
  UpdateValueInput<typeof cast, { defined: true; extended: false }>,
  MyNestedType
> = 1
assertCast

// The property read reported in #1197, which failed with TS2339 when the cast
// widened to unknown.
const readCastProperty = (
  myNestedType: UpdateValueInput<typeof cast, { defined: true; extended: false }>
): string => myNestedType.hello
readCastProperty
