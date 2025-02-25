import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { $elements, $keys } from '../constants/attributeOptions.js'
import type { Always, AtLeastOnce, Never } from '../constants/index.js'
import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Validator } from '../types/validator.js'
import type { FreezeRecordAttribute } from './freeze.js'
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

    const assertType: A.Equals<(typeof rec)['type'], 'record'> = 1
    assertType
    expect(rec.type).toBe('record')

    const assertState: A.Equals<(typeof rec)['state'], {}> = 1
    assertState
    expect(rec.state).toStrictEqual({})

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
      (typeof recAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)['state'], { required: Never }> = 1
    assertNever

    expect(recAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(recAlways.state.required).toBe('always')
    expect(recNever.state.required).toBe('never')
  })

  test('returns required record (method)', () => {
    const recAtLeastOnce = record(fooBar, str).required()
    const recAlways = record(fooBar, str).required('always')
    const recNever = record(fooBar, str).required('never')
    const recOpt = record(fooBar, str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof recAtLeastOnce)['state'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)['state'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)['state'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof recOpt)['state'], { required: Never }> = 1
    assertOpt

    expect(recAtLeastOnce.state.required).toBe('atLeastOnce')
    expect(recAlways.state.required).toBe('always')
    expect(recNever.state.required).toBe('never')
  })

  test('returns hidden record (option)', () => {
    const rec = record(fooBar, str, { hidden: true })

    const assertRec: A.Contains<(typeof rec)['state'], { hidden: true }> = 1
    assertRec

    expect(rec.state.hidden).toBe(true)
  })

  test('returns hidden record (method)', () => {
    const rec = record(fooBar, str).hidden()

    const assertRec: A.Contains<(typeof rec)['state'], { hidden: true }> = 1
    assertRec

    expect(rec.state.hidden).toBe(true)
  })

  test('returns key record (option)', () => {
    const rec = record(fooBar, str, { key: true })

    const assertRec: A.Contains<(typeof rec)['state'], { key: true }> = 1
    assertRec

    expect(rec.state.key).toBe(true)
  })

  test('returns key record (method)', () => {
    const rec = record(fooBar, str).key()

    const assertRec: A.Contains<(typeof rec)['state'], { key: true; required: Always }> = 1
    assertRec

    expect(rec.state.key).toBe(true)
    expect(rec.state.required).toBe('always')
  })

  test('returns savedAs record (option)', () => {
    const rec = record(fooBar, str, { savedAs: 'foo' })

    const assertRec: A.Contains<(typeof rec)['state'], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec.state.savedAs).toBe('foo')
  })

  test('returns savedAs record (method)', () => {
    const rec = record(fooBar, str).savedAs('foo')

    const assertRec: A.Contains<(typeof rec)['state'], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec.state.savedAs).toBe('foo')
  })

  test('returns defaulted record (option)', () => {
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      keyDefault: { foo: 'foo' }
    })

    const assertRecA: A.Contains<(typeof rcA)['state'], { keyDefault: unknown }> = 1
    assertRecA

    expect(rcA.state.keyDefault).toStrictEqual({ foo: 'foo' })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      putDefault: { bar: 'bar' }
    })

    const assertRecB: A.Contains<(typeof rcB)['state'], { putDefault: unknown }> = 1
    assertRecB

    expect(rcB.state.putDefault).toStrictEqual({ bar: 'bar' })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      updateDefault: { foo: 'bar' }
    })

    const assertRecC: A.Contains<(typeof rcC)['state'], { updateDefault: unknown }> = 1
    assertRecC

    expect(rcC.state.updateDefault).toStrictEqual({ foo: 'bar' })
  })

  test('returns defaulted record (method)', () => {
    const rcA = record(fooBar, str).key().keyDefault({ foo: 'foo' })

    const assertRecA: A.Contains<(typeof rcA)['state'], { keyDefault: unknown }> = 1
    assertRecA

    expect(rcA.state.keyDefault).toStrictEqual({ foo: 'foo' })

    const rcB = record(fooBar, str).putDefault({ bar: 'bar' })

    const assertRecB: A.Contains<(typeof rcB)['state'], { putDefault: unknown }> = 1
    assertRecB

    expect(rcB.state.putDefault).toStrictEqual({ bar: 'bar' })

    const rcC = record(fooBar, str).updateDefault({ foo: 'bar' })

    const assertRecC: A.Contains<(typeof rcC)['state'], { updateDefault: unknown }> = 1
    assertRecC

    expect(rcC.state.updateDefault).toStrictEqual({ foo: 'bar' })
  })

  test('returns record with PUT default value if it is not key (default shorthand)', () => {
    const rec = record(fooBar, str).default({ foo: 'foo' })

    const assertRec: A.Contains<(typeof rec)['state'], { putDefault: unknown }> = 1
    assertRec

    expect(rec.state.putDefault).toStrictEqual({ foo: 'foo' })
  })

  test('returns record with KEY default value if it is key (default shorthand)', () => {
    const rec = record(fooBar, str).key().default({ foo: 'foo' })

    const assertRec: A.Contains<(typeof rec)['state'], { keyDefault: unknown }> = 1
    assertRec

    expect(rec.state.keyDefault).toStrictEqual({ foo: 'foo' })
  })

  test('returns linked record (option)', () => {
    const sayHello = () => ({ hello: 'world' })
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      keyLink: sayHello
    })

    const assertRecA: A.Contains<(typeof rcA)['state'], { keyLink: unknown }> = 1
    assertRecA

    expect(rcA.state.keyLink).toBe(sayHello)

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      putLink: sayHello
    })

    const assertRecB: A.Contains<(typeof rcB)['state'], { putLink: unknown }> = 1
    assertRecB

    expect(rcB.state.putLink).toBe(sayHello)

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      updateLink: sayHello
    })

    const assertRecC: A.Contains<(typeof rcC)['state'], { updateLink: unknown }> = 1
    assertRecC

    expect(rcC.state.updateLink).toBe(sayHello)
  })

  test('returns linked record (method)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rcA = record(fooBar, str).key().keyLink(sayHello)

    const assertRecA: A.Contains<(typeof rcA)['state'], { keyLink: unknown }> = 1
    assertRecA

    expect(rcA.state.keyLink).toBe(sayHello)

    const rcB = record(fooBar, str).putLink(sayHello)

    const assertRecB: A.Contains<(typeof rcB)['state'], { putLink: unknown }> = 1
    assertRecB

    expect(rcB.state.putLink).toBe(sayHello)

    const rcC = record(fooBar, str).updateLink(sayHello)

    const assertRecC: A.Contains<(typeof rcC)['state'], { updateLink: unknown }> = 1
    assertRecC

    expect(rcC.state.updateLink).toBe(sayHello)
  })

  test('returns record with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).link(sayHello)

    const assertRec: A.Contains<(typeof rec)['state'], { putLink: unknown }> = 1
    assertRec

    expect(rec.state.putLink).toBe(sayHello)
  })

  test('returns record with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).key().link(sayHello)

    const assertRec: A.Contains<(typeof rec)['state'], { keyLink: unknown }> = 1
    assertRec

    expect(rec.state.keyLink).toBe(sayHello)
  })

  test('returns record with validator (option)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const recordA = record(string(), number(), { keyValidator: pass })
    const recordB = record(string(), number(), { putValidator: pass })
    const recordC = record(string(), number(), { updateValidator: pass })

    const assertRecordA: A.Contains<(typeof recordA)['state'], { keyValidator: Validator }> = 1
    assertRecordA

    expect(recordA.state.keyValidator).toBe(pass)

    const assertRecordB: A.Contains<(typeof recordB)['state'], { putValidator: Validator }> = 1
    assertRecordB

    expect(recordB.state.putValidator).toBe(pass)

    const assertRecordC: A.Contains<(typeof recordC)['state'], { updateValidator: Validator }> = 1
    assertRecordC

    expect(recordC.state.updateValidator).toBe(pass)
  })

  test('returns record with validator (method)', () => {
    const pass = () => true

    const recordA = record(string(), number()).keyValidate(pass)
    const recordB = record(string(), number()).putValidate(pass)
    const recordC = record(string(), number()).updateValidate(pass)

    const assertRecordA: A.Contains<(typeof recordA)['state'], { keyValidator: Validator }> = 1
    assertRecordA

    expect(recordA.state.keyValidator).toBe(pass)

    const assertRecordB: A.Contains<(typeof recordB)['state'], { putValidator: Validator }> = 1
    assertRecordB

    expect(recordB.state.putValidator).toBe(pass)

    const assertRecordC: A.Contains<(typeof recordC)['state'], { updateValidator: Validator }> = 1
    assertRecordC

    expect(recordC.state.updateValidator).toBe(pass)

    const prevRecord = record(string(), number())
    prevRecord.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [{ [x in string]?: number }, FreezeRecordAttribute<typeof prevRecord>]
      > = 1
      assertArgs

      return true
    })

    const prevOptMap = record(string(), number()).optional()
    prevOptMap.validate((...args) => {
      const assertArgs: A.Equals<
        typeof args,
        [{ [x in string]?: number }, FreezeRecordAttribute<typeof prevOptMap>]
      > = 1
      assertArgs

      return true
    })
  })

  test('returns record with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _record = record(string(), number()).validate(pass)

    const assertRecord: A.Contains<(typeof _record)['state'], { putValidator: Validator }> = 1
    assertRecord

    expect(_record.state.putValidator).toBe(pass)
  })

  test('returns record with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _record = record(string(), number()).key().validate(pass)

    const assertRecord: A.Contains<(typeof _record)['state'], { keyValidator: Validator }> = 1
    assertRecord

    expect(_record.state.keyValidator).toBe(pass)
  })

  test('record of records', () => {
    const rec = record(fooBar, record(fooBar, str))

    const assertRec: A.Contains<
      typeof rec,
      {
        type: 'record'
        [$keys]: typeof fooBar
        [$elements]: {
          type: 'record'
          [$keys]: typeof fooBar
          [$elements]: typeof str
          state: {}
        }
        state: {}
      }
    > = 1
    assertRec
  })
})
