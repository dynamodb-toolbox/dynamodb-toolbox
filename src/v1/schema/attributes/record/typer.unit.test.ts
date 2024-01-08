import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors'

import { Never, AtLeastOnce, Always } from '../constants'
import { string, number } from '../primitive'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults
} from '../constants/attributeOptions'

import { record } from './typer'
import type { RecordAttribute, $RecordAttributeState } from './interface'

describe('record', () => {
  const path = 'some.path'
  const fooBar = string().enum('foo', 'bar')
  const str = string()

  it('rejects non-string keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      number(),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.invalidKeys', path })
    )
  })

  it('rejects non-required keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.optional(),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.optionalKeys', path })
    )
  })

  it('rejects hidden keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.hidden(),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.hiddenKeys', path })
    )
  })

  it('rejects key keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.key(),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.keyKeys', path })
    )
  })

  it('rejects keys with savedAs values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.savedAs('foo'),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.savedAsKeys', path })
    )
  })

  it('rejects keys with default values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.putDefault('foo'),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.defaultedKeys', path })
    )
  })

  it('rejects non-required elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.optional()
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.optionalElements', path })
    )
  })

  it('rejects hidden elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.hiddenElements', path })
    )
  })

  it('rejects key elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.key()
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.keyElements', path })
    )
  })

  it('rejects elements with savedAs values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.savedAsElements', path })
    )
  })

  it('rejects elements with default values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.putDefault('foo')
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.defaultedElements', path })
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
        [$defaults]: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertRec

    const assertExtends: A.Extends<typeof rec, $RecordAttributeState> = 1
    assertExtends

    const frozenRecord = rec.freeze(path)
    const assertFrozen: A.Extends<typeof frozenRecord, RecordAttribute> = 1
    assertFrozen

    expect(rec).toMatchObject({
      [$type]: 'record',
      [$keys]: str,
      [$elements]: str,
      [$required]: 'atLeastOnce',
      [$key]: false,
      [$savedAs]: undefined,
      [$hidden]: false,
      [$defaults]: {
        key: undefined,
        put: undefined,
        update: undefined
      }
    })
  })

  it('returns required record (option)', () => {
    const recAtLeastOnce = record(fooBar, str, { required: 'atLeastOnce' })
    const recAlways = record(fooBar, str, { required: 'always' })
    const recNever = record(fooBar, str, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof recAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof recAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof recNever, { [$required]: Never }> = 1
    assertNever

    expect(recAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
    expect(recAlways).toMatchObject({ [$required]: 'always' })
    expect(recNever).toMatchObject({ [$required]: 'never' })
  })

  it('returns required record (method)', () => {
    const recAtLeastOnce = record(fooBar, str).required()
    const recAlways = record(fooBar, str).required('always')
    const recNever = record(fooBar, str).required('never')
    const recOpt = record(fooBar, str).optional()

    const assertAtLeastOnce: A.Contains<typeof recAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof recAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof recNever, { [$required]: Never }> = 1
    assertNever
    const assertOpt: A.Contains<typeof recOpt, { [$required]: Never }> = 1
    assertOpt

    expect(recAtLeastOnce).toMatchObject({ [$required]: 'atLeastOnce' })
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

  it('returns defaulted record (option)', () => {
    const stA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: { foo: 'foo' }, put: undefined, update: undefined }
    })

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA).toMatchObject({
      [$defaults]: { key: { foo: 'foo' }, put: undefined, update: undefined }
    })

    const stB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: { bar: 'bar' }, update: undefined }
    })

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB).toMatchObject({
      [$defaults]: { key: undefined, put: { bar: 'bar' }, update: undefined }
    })

    const stC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: undefined, update: { foo: 'bar' } }
    })

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: { foo: 'bar' } }
    })
  })

  it('returns defaulted record (method)', () => {
    const stA = record(fooBar, str).key().keyDefault({ foo: 'foo' })

    const assertSetA: A.Contains<
      typeof stA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertSetA

    expect(stA).toMatchObject({
      [$defaults]: { key: { foo: 'foo' }, put: undefined, update: undefined }
    })

    const stB = record(fooBar, str).putDefault({ bar: 'bar' })

    const assertSetB: A.Contains<
      typeof stB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertSetB

    expect(stB).toMatchObject({
      [$defaults]: { key: undefined, put: { bar: 'bar' }, update: undefined }
    })

    const stC = record(fooBar, str).updateDefault({ foo: 'bar' })

    const assertSetC: A.Contains<
      typeof stC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertSetC

    expect(stC).toMatchObject({
      [$defaults]: { key: undefined, put: undefined, update: { foo: 'bar' } }
    })
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
          [$defaults]: {
            key: undefined
            put: undefined
            update: undefined
          }
        }
        [$required]: AtLeastOnce
        [$hidden]: false
        [$key]: false
        [$savedAs]: undefined
        [$defaults]: {
          key: undefined
          put: undefined
          update: undefined
        }
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
        [$defaults]: {
          key: undefined,
          put: undefined,
          update: undefined
        }
      },
      [$required]: 'atLeastOnce',
      [$hidden]: false,
      [$key]: false,
      [$savedAs]: undefined,
      [$defaults]: {
        key: undefined,
        put: undefined,
        update: undefined
      }
    })
  })
})
