import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { ComputedDefault, Never, AtLeastOnce, OnlyOnce, Always } from '../constants'
import { constant } from '../constant'
import { string, number } from '../primitive'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $default
} from '../constants/attributeOptions'

import { record } from './typer'
import { freezeRecordAttribute } from './freeze'
import type { RecordAttribute, $RecordAttribute } from './interface'

describe('record', () => {
  const path = 'some.path'
  const fooBar = string().enum('foo', 'bar')
  const str = string()

  it('rejects non-string or constant keys', () => {
    record(
      // @ts-expect-error
      number(),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          number(),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidRecordAttributeKeys', path })
    )
  })

  it('rejects non-string constant keys', () => {
    record(
      // @ts-expect-error
      constant(42),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          constant(42),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'invalidRecordAttributeKeys', path })
    )
  })

  it('rejects non-required keys', () => {
    record(
      // @ts-expect-error
      str.optional(),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.optional(),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'optionalRecordAttributeKeys', path })
    )
  })

  it('rejects hidden keys', () => {
    record(
      // @ts-expect-error
      str.hidden(),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.hidden(),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'hiddenRecordAttributeKeys', path })
    )
  })

  it('rejects key keys', () => {
    record(
      // @ts-expect-error
      str.key(),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.key(),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'keyRecordAttributeKeys', path }))
  })

  it('rejects keys with savedAs values', () => {
    record(
      // @ts-expect-error
      str.savedAs('foo'),
      str
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.savedAs('foo'),
          str
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'savedAsRecordAttributeKeys', path })
    )
  })

  it('rejects keys with default values', () => {
    record(
      // @ts-expect-error
      str.default('foo'),
      str
    )

    const invalidCallA = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.default('foo'),
          str
        ),
        path
      )

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedRecordAttributeKeys', path })
    )

    record(
      // @ts-expect-error
      str.default(ComputedDefault),
      str
    )

    const invalidCallB = () =>
      freezeRecordAttribute(
        record(
          // @ts-expect-error
          str.default(ComputedDefault),
          str
        ),
        path
      )

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedRecordAttributeKeys', path })
    )
  })

  it('rejects non-required elements', () => {
    record(
      str,
      // @ts-expect-error
      str.optional()
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.optional()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'optionalRecordAttributeElements', path })
    )
  })

  it('rejects hidden elements', () => {
    record(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.hidden()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'hiddenRecordAttributeElements', path })
    )
  })

  it('rejects key elements', () => {
    record(
      str,
      // @ts-expect-error
      str.key()
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.key()
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'keyRecordAttributeElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    record(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const invalidCall = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.savedAs('foo')
        ),
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'savedAsRecordAttributeElements', path })
    )
  })

  it('rejects elements with default values', () => {
    record(
      str,
      // @ts-expect-error
      str.default('foo')
    )

    const invalidCallA = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.default('foo')
        ),
        path
      )

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedRecordAttributeElements', path })
    )

    record(
      str,
      // @ts-expect-error
      str.default(ComputedDefault)
    )

    const invalidCallB = () =>
      freezeRecordAttribute(
        record(
          str,
          // @ts-expect-error
          str.default(ComputedDefault)
        ),
        path
      )

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({ code: 'defaultedRecordAttributeElements', path })
    )
  })

  it('returns default record', () => {
    const rec = record(fooBar, str)

    const assertRec: A.Contains<
      typeof rec,
      {
        [$type]: 'record'
        [$keys]: typeof fooBar
        [$elements]: typeof str
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$default]: undefined
      }
    > = 1
    assertRec

    const assertExtends: A.Extends<typeof rec, $RecordAttribute> = 1
    assertExtends

    const frozenRecord = freezeRecordAttribute(rec, path)
    const assertFrozen: A.Extends<typeof frozenRecord, RecordAttribute> = 1
    assertFrozen

    expect(rec).toMatchObject({
      [$type]: 'record',
      [$keys]: str,
      [$elements]: str,
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$savedAs]: undefined,
      [$hidden]: false
    })
  })

  it('returns required record (option)', () => {
    const recAtLeastOnce = record(fooBar, str, { required: 'atLeastOnce' })
    const recOnlyOnce = record(fooBar, str, { required: 'onlyOnce' })
    const recAlways = record(fooBar, str, { required: 'always' })
    const recNever = record(fooBar, str, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof recAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof recOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof recAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof recNever, { [$required]: Never }> = 1
    assertNever

    expect(recAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(recOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(recAlways).toMatchObject({ [$required]: 'always' })
    expect(recNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required record (method)', () => {
    const recAtLeastOnce = record(fooBar, str).required()
    const recOnlyOnce = record(fooBar, str).required('onlyOnce')
    const recAlways = record(fooBar, str).required('always')
    const recNever = record(fooBar, str).required('never')
    const recOpt = record(fooBar, str).optional()

    const assertAtLeastOnce: A.Contains<typeof recAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertOnlyOnce: A.Contains<typeof recOnlyOnce, { [$required]: OnlyOnce }> = 1
    assertOnlyOnce
    const assertAlways: A.Contains<typeof recAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof recNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof recOpt, { [$required]: Never }> = 1
    assertOpt

    expect(recAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(recOnlyOnce).toMatchObject({ [$required]: 'onlyOnce' })
    expect(recAlways).toMatchObject({ [$required]: 'always' })
    expect(recNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns hidden record (option)', () => {
    const rec = record(fooBar, str, { hidden: true })

    const assertRec: A.Contains<typeof rec, { [$hidden]: true }> = 1
    assertRec

    expect(rec).toMatchObject({ [$hidden]: true })
  })

  it('returns hidden record (method)', () => {
    const rec = record(fooBar, str).hidden()

    const assertRec: A.Contains<typeof rec, { [$hidden]: true }> = 1
    assertRec

    expect(rec).toMatchObject({ [$hidden]: true })
  })

  it('returns key record (option)', () => {
    const rec = record(fooBar, str, { key: true })

    const assertRec: A.Contains<typeof rec, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertRec

    expect(rec).toMatchObject({ [$key]: true, [$required]: 'atLeastOnce' })
  })

  it('returns key record (method)', () => {
    const rec = record(fooBar, str).key()

    const assertRec: A.Contains<typeof rec, { [$key]: true; [$required]: Always }> = 1
    assertRec

    expect(rec).toMatchObject({ [$key]: true, [$required]: 'always' })
  })

  it('returns savedAs record (option)', () => {
    const rec = record(fooBar, str, { savedAs: 'foo' })

    const assertRec: A.Contains<typeof rec, { [$savedAs]: 'foo' }> = 1
    assertRec

    expect(rec).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('returns savedAs record (method)', () => {
    const rec = record(fooBar, str).savedAs('foo')

    const assertRec: A.Contains<typeof rec, { [$savedAs]: 'foo' }> = 1
    assertRec

    expect(rec).toMatchObject({ [$savedAs]: 'foo' })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const rec = record(fooBar, str, { default: ComputedDefault })

    const assertRec: A.Contains<typeof rec, { [$default]: ComputedDefault }> = 1
    assertRec

    expect(rec).toMatchObject({ [$default]: ComputedDefault })
  })

  it('accepts ComputedDefault as default value (option)', () => {
    const rec = record(fooBar, str).default(ComputedDefault)

    const assertRec: A.Contains<typeof rec, { [$default]: ComputedDefault }> = 1
    assertRec

    expect(rec).toMatchObject({ [$default]: ComputedDefault })
  })

  it('record of records', () => {
    const rec = record(fooBar, record(fooBar, str))

    const assertRec: A.Contains<
      typeof rec,
      {
        [$type]: 'record'
        [$keys]: typeof fooBar
        [$elements]: {
          [$type]: 'record'
          [$keys]: typeof fooBar
          [$elements]: typeof str
          [$required]: AtLeastOnce
          [$hidden]: false
          [$key]: false
          [$savedAs]: undefined
          [$default]: undefined
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$default]: undefined
      }
    > = 1
    assertRec

    expect(rec).toMatchObject({
      [$type]: 'record',
      [$keys]: fooBar,
      [$elements]: {
        [$type]: 'record',
        [$keys]: fooBar,
        [$elements]: str,
        [$required]: 'atLeastOnce',
        [$hidden]: false,
        [$key]: false,
        [$savedAs]: undefined,
        [$default]: undefined
      },
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$default]: undefined
    })
  })
})
