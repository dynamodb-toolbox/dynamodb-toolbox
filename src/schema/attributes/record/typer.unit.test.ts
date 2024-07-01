import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $elements, $keys, $state, $type } from '../constants/attributeOptions.js'
import { Always, AtLeastOnce, Never } from '../constants/index.js'
import { number, string } from '../primitive/index.js'
import type { $RecordAttributeState, RecordAttribute } from './interface.js'
import { record } from './typer.js'

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

    const assertType: A.Equals<(typeof rec)[$type], 'record'> = 1
    assertType
    expect(rec[$type]).toBe('record')

    const assertState: A.Contains<
      (typeof rec)[$state],
      {
        required: AtLeastOnce
        hidden: false
        key: false
        savedAs: undefined
        defaults: {
          key: undefined
          put: undefined
          update: undefined
        }
        links: {
          key: undefined
          put: undefined
          update: undefined
        }
      }
    > = 1
    assertState
    expect(rec[$state]).toStrictEqual({
      required: 'atLeastOnce',
      key: false,
      savedAs: undefined,
      hidden: false,
      defaults: { key: undefined, put: undefined, update: undefined },
      links: { key: undefined, put: undefined, update: undefined }
    })

    const assertKeys: A.Equals<(typeof rec)[$keys], typeof fooBar> = 1
    assertKeys
    expect(rec[$keys]).toBe(fooBar)

    const assertElements: A.Equals<(typeof rec)[$elements], typeof str> = 1
    assertElements
    expect(rec[$elements]).toBe(str)

    const assertExtends: A.Extends<typeof rec, $RecordAttributeState> = 1
    assertExtends

    const frozenRecord = rec.freeze(path)
    const assertFrozen: A.Extends<typeof frozenRecord, RecordAttribute> = 1
    assertFrozen
  })

  test('returns required record (option)', () => {
    const recAtLeastOnce = record(fooBar, str, { required: 'atLeastOnce' })
    const recAlways = record(fooBar, str, { required: 'always' })
    const recNever = record(fooBar, str, { required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof recAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)[$state], { required: Never }> = 1
    assertNever

    expect(recAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(recAlways[$state].required).toBe('always')
    expect(recNever[$state].required).toBe('never')
  })

  test('returns required record (method)', () => {
    const recAtLeastOnce = record(fooBar, str).required()
    const recAlways = record(fooBar, str).required('always')
    const recNever = record(fooBar, str).required('never')
    const recOpt = record(fooBar, str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof recAtLeastOnce)[$state],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)[$state], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)[$state], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof recOpt)[$state], { required: Never }> = 1
    assertOpt

    expect(recAtLeastOnce[$state].required).toBe('atLeastOnce')
    expect(recAlways[$state].required).toBe('always')
    expect(recNever[$state].required).toBe('never')
  })

  test('returns hidden record (option)', () => {
    const rec = record(fooBar, str, { hidden: true })

    const assertRec: A.Contains<(typeof rec)[$state], { hidden: true }> = 1
    assertRec

    expect(rec[$state].hidden).toBe(true)
  })

  test('returns hidden record (method)', () => {
    const rec = record(fooBar, str).hidden()

    const assertRec: A.Contains<(typeof rec)[$state], { hidden: true }> = 1
    assertRec

    expect(rec[$state].hidden).toBe(true)
  })

  test('returns key record (option)', () => {
    const rec = record(fooBar, str, { key: true })

    const assertRec: A.Contains<(typeof rec)[$state], { key: true; required: AtLeastOnce }> = 1
    assertRec

    expect(rec[$state].key).toBe(true)
    expect(rec[$state].required).toBe('atLeastOnce')
  })

  test('returns key record (method)', () => {
    const rec = record(fooBar, str).key()

    const assertRec: A.Contains<(typeof rec)[$state], { key: true; required: Always }> = 1
    assertRec

    expect(rec[$state].key).toBe(true)
    expect(rec[$state].required).toBe('always')
  })

  test('returns savedAs record (option)', () => {
    const rec = record(fooBar, str, { savedAs: 'foo' })

    const assertRec: A.Contains<(typeof rec)[$state], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec[$state].savedAs).toBe('foo')
  })

  test('returns savedAs record (method)', () => {
    const rec = record(fooBar, str).savedAs('foo')

    const assertRec: A.Contains<(typeof rec)[$state], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec[$state].savedAs).toBe('foo')
  })

  test('returns defaulted record (option)', () => {
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: { foo: 'foo' }, put: undefined, update: undefined }
    })

    const assertRecA: A.Contains<
      (typeof rcA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$state].defaults).toStrictEqual({
      key: { foo: 'foo' },
      put: undefined,
      update: undefined
    })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: { bar: 'bar' }, update: undefined }
    })

    const assertRecB: A.Contains<
      (typeof rcB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$state].defaults).toStrictEqual({
      key: undefined,
      put: { bar: 'bar' },
      update: undefined
    })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      defaults: { key: undefined, put: undefined, update: { foo: 'bar' } }
    })

    const assertRecC: A.Contains<
      (typeof rcC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { foo: 'bar' }
    })
  })

  test('returns defaulted record (method)', () => {
    const rcA = record(fooBar, str).key().keyDefault({ foo: 'foo' })

    const assertRecA: A.Contains<
      (typeof rcA)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$state].defaults).toStrictEqual({
      key: { foo: 'foo' },
      put: undefined,
      update: undefined
    })

    const rcB = record(fooBar, str).putDefault({ bar: 'bar' })

    const assertRecB: A.Contains<
      (typeof rcB)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$state].defaults).toStrictEqual({
      key: undefined,
      put: { bar: 'bar' },
      update: undefined
    })

    const rcC = record(fooBar, str).updateDefault({ foo: 'bar' })

    const assertRecC: A.Contains<
      (typeof rcC)[$state],
      { defaults: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$state].defaults).toStrictEqual({
      key: undefined,
      put: undefined,
      update: { foo: 'bar' }
    })
  })

  test('returns record with PUT default value if it is not key (default shorthand)', () => {
    const rec = record(fooBar, str).default({ foo: 'foo' })

    const assertRec: A.Contains<
      (typeof rec)[$state],
      { defaults: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRec

    expect(rec[$state].defaults).toStrictEqual({
      key: undefined,
      put: { foo: 'foo' },
      update: undefined
    })
  })

  test('returns record with KEY default value if it is key (default shorthand)', () => {
    const rec = record(fooBar, str).key().default({ foo: 'foo' })

    const assertRec: A.Contains<
      (typeof rec)[$state],
      { defaults: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRec

    expect(rec[$state].defaults).toStrictEqual({
      key: { foo: 'foo' },
      put: undefined,
      update: undefined
    })
  })

  test('returns linked record (option)', () => {
    const sayHello = () => ({ hello: 'world' })
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: sayHello, put: undefined, update: undefined }
    })

    const assertRecA: A.Contains<
      (typeof rcA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: undefined, put: sayHello, update: undefined }
    })

    const assertRecB: A.Contains<
      (typeof rcB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      links: { key: undefined, put: undefined, update: sayHello }
    })

    const assertRecC: A.Contains<
      (typeof rcC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns linked record (method)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rcA = record(fooBar, str).key().keyLink(sayHello)

    const assertRecA: A.Contains<
      (typeof rcA)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRecA

    expect(rcA[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })

    const rcB = record(fooBar, str).putLink(sayHello)

    const assertRecB: A.Contains<
      (typeof rcB)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRecB

    expect(rcB[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })

    const rcC = record(fooBar, str).updateLink(sayHello)

    const assertRecC: A.Contains<
      (typeof rcC)[$state],
      { links: { key: undefined; put: undefined; update: unknown } }
    > = 1
    assertRecC

    expect(rcC[$state].links).toStrictEqual({ key: undefined, put: undefined, update: sayHello })
  })

  test('returns record with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).link(sayHello)

    const assertRec: A.Contains<
      (typeof rec)[$state],
      { links: { key: undefined; put: unknown; update: undefined } }
    > = 1
    assertRec

    expect(rec[$state].links).toStrictEqual({ key: undefined, put: sayHello, update: undefined })
  })

  test('returns record with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).key().link(sayHello)

    const assertRec: A.Contains<
      (typeof rec)[$state],
      { links: { key: unknown; put: undefined; update: undefined } }
    > = 1
    assertRec

    expect(rec[$state].links).toStrictEqual({ key: sayHello, put: undefined, update: undefined })
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
          [$state]: {
            required: AtLeastOnce
            hidden: false
            key: false
            savedAs: undefined
            defaults: {
              key: undefined
              put: undefined
              update: undefined
            }
          }
        }
        [$state]: {
          required: AtLeastOnce
          hidden: false
          key: false
          savedAs: undefined
          defaults: {
            key: undefined
            put: undefined
            update: undefined
          }
        }
      }
    > = 1
    assertRec
  })
})
