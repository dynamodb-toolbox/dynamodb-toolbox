import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from 'v1/errors/index.js'

import { Never, AtLeastOnce, Always } from '../constants/index.js'
import { string, number } from '../primitive/index.js'
import {
  $type,
  $keys,
  $elements,
  $required,
  $hidden,
  $key,
  $savedAs,
  $defaults,
  $links
} from '../constants/attributeOptions.js'

import { record } from './typer.js'
import type { RecordAttribute, $RecordAttributeState } from './interface.js'

describe('record', () => {
  const path = 'some.path'
  const fooBar = string().enum('foo', 'bar')
  const str = string()

  test('rejects non-string keys', () => {
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

  test('rejects non-required keys', () => {
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

  test('rejects hidden keys', () => {
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

  test('rejects key keys', () => {
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

  test('rejects keys with savedAs values', () => {
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

  test('rejects keys with default values', () => {
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

  test('rejects keys with linked values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.putLink(() => 'foo'),
      str
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.defaultedKeys', path })
    )
  })

  test('rejects non-required elements', () => {
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

  test('rejects hidden elements', () => {
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

  test('rejects key elements', () => {
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

  test('rejects elements with savedAs values', () => {
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

  test('rejects elements with default values', () => {
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

  test('rejects elements with linked values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.putLink(() => 'foo')
    )

    const invalidCall = () => invalidRecord.freeze(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.recordAttribute.defaultedElements', path })
    )
  })

  test('returns default record', () => {
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
        [$links]: {
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

    expect(rec[$type]).toBe('record')
    expect(rec[$keys]).toBe(fooBar)
    expect(rec[$elements]).toBe(str)
    expect(rec[$required]).toBe('atLeastOnce')
    expect(rec[$key]).toBe(false)
    expect(rec[$savedAs]).toBe(undefined)
    expect(rec[$hidden]).toBe(false)
    expect(rec[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
    expect(rec[$links]).toStrictEqual({ key: undefined, put: undefined, update: undefined })
  })

  test('returns required record (option)', () => {
    const recAtLeastOnce = record(fooBar, str, { required: 'atLeastOnce' })
    const recAlways = record(fooBar, str, { required: 'always' })
    const recNever = record(fooBar, str, { required: 'never' })

    const assertAtLeastOnce: A.Contains<typeof recAtLeastOnce, { [$required]: AtLeastOnce }> = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<typeof recAlways, { [$required]: Always }> = 1
    assertAlways
    const assertNever: A.Contains<typeof recNever, { [$required]: Never }> = 1
    assertNever

    expect(recAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(recAlways[$required]).toBe('always')
    expect(recNever[$required]).toBe('never')
  })

  test('returns required record (method)', () => {
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

    expect(recAtLeastOnce[$required]).toBe('atLeastOnce')
    expect(recAlways[$required]).toBe('always')
    expect(recNever[$required]).toBe('never')
  })

  test('returns hidden record (option)', () => {
    const rec = record(fooBar, str, { hidden: true })

    const assertRec: A.Contains<typeof rec, { [$hidden]: true }> = 1
    assertRec

    expect(rec[$hidden]).toBe(true)
  })

  test('returns hidden record (method)', () => {
    const rec = record(fooBar, str).hidden()

    const assertRec: A.Contains<typeof rec, { [$hidden]: true }> = 1
    assertRec

    expect(rec[$hidden]).toBe(true)
  })

  test('returns key record (option)', () => {
    const rec = record(fooBar, str, { key: true })

    const assertRec: A.Contains<typeof rec, { [$key]: true; [$required]: AtLeastOnce }> = 1
    assertRec

    expect(rec[$key]).toBe(true)
    expect(rec[$required]).toBe('atLeastOnce')
  })

  test('returns key record (method)', () => {
    const rec = record(fooBar, str).key()

    const assertRec: A.Contains<typeof rec, { [$key]: true; [$required]: Always }> = 1
    assertRec

    expect(rec[$key]).toBe(true)
    expect(rec[$required]).toBe('always')
  })

  test('returns savedAs record (option)', () => {
    const rec = record(fooBar, str, { savedAs: 'foo' })

    const assertRec: A.Contains<typeof rec, { [$savedAs]: 'foo' }> = 1
    assertRec

    expect(rec[$savedAs]).toBe('foo')
  })

  test('returns savedAs record (method)', () => {
    const rec = record(fooBar, str).savedAs('foo')

    const assertRec: A.Contains<typeof rec, { [$savedAs]: 'foo' }> = 1
    assertRec

    expect(rec[$savedAs]).toBe('foo')
  })

  test('returns defaulted record (option)', () => {
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: { foo: 'foo' }, put: undefined, update: undefined }
    })

    const assertRecA: A.Contains<
      typeof rcA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$defaults]).toStrictEqual({ key: { foo: 'foo' }, put: undefined, update: undefined })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: { bar: 'bar' }, update: undefined }
    })

    const assertRecB: A.Contains<
      typeof rcB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$defaults]).toStrictEqual({ key: undefined, put: { bar: 'bar' }, update: undefined })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: undefined, update: { foo: 'bar' } }
    })

    const assertRecC: A.Contains<
      typeof rcC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: { foo: 'bar' } })
  })

  test('returns defaulted record (method)', () => {
    const rcA = record(fooBar, str).key().keyDefault({ foo: 'foo' })

    const assertRecA: A.Contains<
      typeof rcA,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$defaults]).toStrictEqual({ key: { foo: 'foo' }, put: undefined, update: undefined })

    const rcB = record(fooBar, str).putDefault({ bar: 'bar' })

    const assertRecB: A.Contains<
      typeof rcB,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$defaults]).toStrictEqual({ key: undefined, put: { bar: 'bar' }, update: undefined })

    const rcC = record(fooBar, str).updateDefault({ foo: 'bar' })

    const assertRecC: A.Contains<
      typeof rcC,
      { [$defaults]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$defaults]).toStrictEqual({ key: undefined, put: undefined, update: { foo: 'bar' } })
  })

  test('returns record with PUT default value if it is not key (default shorthand)', () => {
    const rec = record(fooBar, str).default({ foo: 'foo' })

    const assertRec: A.Contains<
      typeof rec,
      { [$defaults]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRec

    expect(rec[$defaults]).toStrictEqual({ key: undefined, put: { foo: 'foo' }, update: undefined })
  })

  test('returns record with KEY default value if it is key (default shorthand)', () => {
    const rec = record(fooBar, str).key().default({ foo: 'foo' })

    const assertRec: A.Contains<
      typeof rec,
      { [$defaults]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRec

    expect(rec[$defaults]).toStrictEqual({ key: { foo: 'foo' }, put: undefined, update: undefined })
  })

  test('returns linked record (option)', () => {
    const sayHello = () => ({ hello: 'world' })
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: sayHello, put: undefined, update: undefined }
    })

    const assertRecA: A.Contains<
      typeof rcA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: undefined, put: sayHello, update: undefined }
    })

    const assertRecB: A.Contains<
      typeof rcB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: undefined, put: undefined, update: sayHello }
    })

    const assertRecC: A.Contains<
      typeof rcC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns linked record (method)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rcA = record(fooBar, str).key().keyLink(sayHello)

    const assertRecA: A.Contains<
      typeof rcA,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const rcB = record(fooBar, str).putLink(sayHello)

    const assertRecB: A.Contains<
      typeof rcB,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const rcC = record(fooBar, str).updateLink(sayHello)

    const assertRecC: A.Contains<
      typeof rcC,
      { [$links]: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$links]).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns record with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).link(sayHello)

    const assertRec: A.Contains<
      typeof rec,
      { [$links]: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRec

    expect(rec[$links]).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  test('returns record with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).key().link(sayHello)

    const assertRec: A.Contains<
      typeof rec,
      { [$links]: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRec

    expect(rec[$links]).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
  })

  test('record of records', () => {
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
  })
})
