import type { A } from 'ts-toolbelt'

import { DynamoDBToolboxError } from '~/errors/index.js'

import { number } from '../number/index.js'
import { string } from '../string/index.js'
import type { Always, AtLeastOnce, Never, Validator } from '../types/index.js'
import type { Light } from '../utils/light.js'
import type { RecordSchema } from './schema.js'
import { record } from './schema_.js'

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

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.invalidKeys', path })
    )
  })

  test('rejects non-required keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.optional(),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.optionalKeys', path })
    )
  })

  test('rejects hidden keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.hidden(),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.record.hiddenKeys', path }))
  })

  test('rejects key keys', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.key(),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.record.keyKeys', path }))
  })

  test('rejects keys with savedAs values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.savedAs('foo'),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.savedAsKeys', path })
    )
  })

  test('rejects keys with default values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.putDefault('foo'),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.defaultedKeys', path })
    )
  })

  test('rejects keys with linked values', () => {
    const invalidRecord = record(
      // @ts-expect-error
      str.putLink(() => 'foo'),
      str
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.defaultedKeys', path })
    )
  })

  test('rejects non-required elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.optional()
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.optionalElements', path })
    )
  })

  test('rejects hidden elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.hidden()
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.hiddenElements', path })
    )
  })

  test('rejects key elements', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.key()
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.keyElements', path })
    )
  })

  test('rejects elements with savedAs values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.savedAs('foo')
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.savedAsElements', path })
    )
  })

  test('rejects elements with default values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.putDefault('foo')
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.defaultedElements', path })
    )
  })

  test('rejects elements with linked values', () => {
    const invalidRecord = record(
      str,
      // @ts-expect-error
      str.putLink(() => 'foo')
    )

    const invalidCall = () => invalidRecord.check(path)

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.record.defaultedElements', path })
    )
  })

  test('returns default record', () => {
    const rec = record(fooBar, str)

    const assertType: A.Equals<(typeof rec)['type'], 'record'> = 1
    assertType
    expect(rec.type).toBe('record')

    const assertProps: A.Equals<(typeof rec)['props'], {}> = 1
    assertProps
    expect(rec.props).toStrictEqual({})

    const assertKeys: A.Equals<(typeof rec)['keys'], Light<typeof fooBar>> = 1
    assertKeys
    expect(rec.keys).toBe(fooBar)

    const assertElements: A.Equals<(typeof rec)['elements'], Light<typeof str>> = 1
    assertElements
    expect(rec.elements).toBe(str)

    const assertExtends: A.Extends<typeof rec, RecordSchema> = 1
    assertExtends
  })

  test('returns required record (prop)', () => {
    const recAtLeastOnce = record(fooBar, str, { required: 'atLeastOnce' })
    const recAlways = record(fooBar, str, { required: 'always' })
    const recNever = record(fooBar, str, { required: 'never' })

    const assertAtLeastOnce: A.Contains<
      (typeof recAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)['props'], { required: Never }> = 1
    assertNever

    expect(recAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(recAlways.props.required).toBe('always')
    expect(recNever.props.required).toBe('never')
  })

  test('returns required record (method)', () => {
    const recAtLeastOnce = record(fooBar, str).required()
    const recAlways = record(fooBar, str).required('always')
    const recNever = record(fooBar, str).required('never')
    const recOpt = record(fooBar, str).optional()

    const assertAtLeastOnce: A.Contains<
      (typeof recAtLeastOnce)['props'],
      { required: AtLeastOnce }
    > = 1
    assertAtLeastOnce
    const assertAlways: A.Contains<(typeof recAlways)['props'], { required: Always }> = 1
    assertAlways
    const assertNever: A.Contains<(typeof recNever)['props'], { required: Never }> = 1
    assertNever
    const assertOpt: A.Contains<(typeof recOpt)['props'], { required: Never }> = 1
    assertOpt

    expect(recAtLeastOnce.props.required).toBe('atLeastOnce')
    expect(recAlways.props.required).toBe('always')
    expect(recNever.props.required).toBe('never')
  })

  test('returns hidden record (prop)', () => {
    const rec = record(fooBar, str, { hidden: true })

    const assertRec: A.Contains<(typeof rec)['props'], { hidden: true }> = 1
    assertRec

    expect(rec.props.hidden).toBe(true)
  })

  test('returns hidden record (method)', () => {
    const rec = record(fooBar, str).hidden()

    const assertRec: A.Contains<(typeof rec)['props'], { hidden: true }> = 1
    assertRec

    expect(rec.props.hidden).toBe(true)
  })

  test('returns key record (prop)', () => {
    const rec = record(fooBar, str, { key: true })

    const assertRec: A.Contains<(typeof rec)['props'], { key: true }> = 1
    assertRec

    expect(rec.props.key).toBe(true)
  })

  test('returns key record (method)', () => {
    const rec = record(fooBar, str).key()

    const assertRec: A.Contains<(typeof rec)['props'], { key: true; required: Always }> = 1
    assertRec

    expect(rec.props.key).toBe(true)
    expect(rec.props.required).toBe('always')
  })

  test('returns savedAs record (prop)', () => {
    const rec = record(fooBar, str, { savedAs: 'foo' })

    const assertRec: A.Contains<(typeof rec)['props'], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec.props.savedAs).toBe('foo')
  })

  test('returns savedAs record (method)', () => {
    const rec = record(fooBar, str).savedAs('foo')

    const assertRec: A.Contains<(typeof rec)['props'], { savedAs: 'foo' }> = 1
    assertRec

    expect(rec.props.savedAs).toBe('foo')
  })

  test('returns defaulted record (prop)', () => {
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      keyDefault: { foo: 'foo' }
    })

    const assertRecA: A.Contains<(typeof rcA)['props'], { keyDefault: unknown }> = 1
    assertRecA

    expect(rcA.props.keyDefault).toStrictEqual({ foo: 'foo' })

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      putDefault: { bar: 'bar' }
    })

    const assertRecB: A.Contains<(typeof rcB)['props'], { putDefault: unknown }> = 1
    assertRecB

    expect(rcB.props.putDefault).toStrictEqual({ bar: 'bar' })

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      updateDefault: { foo: 'bar' }
    })

    const assertRecC: A.Contains<(typeof rcC)['props'], { updateDefault: unknown }> = 1
    assertRecC

    expect(rcC.props.updateDefault).toStrictEqual({ foo: 'bar' })
  })

  test('returns defaulted record (method)', () => {
    const rcA = record(fooBar, str).key().keyDefault({ foo: 'foo' })

    const assertRecA: A.Contains<(typeof rcA)['props'], { keyDefault: unknown }> = 1
    assertRecA

    expect(rcA.props.keyDefault).toStrictEqual({ foo: 'foo' })

    const rcB = record(fooBar, str).putDefault({ bar: 'bar' })

    const assertRecB: A.Contains<(typeof rcB)['props'], { putDefault: unknown }> = 1
    assertRecB

    expect(rcB.props.putDefault).toStrictEqual({ bar: 'bar' })

    const rcC = record(fooBar, str).updateDefault({ foo: 'bar' })

    const assertRecC: A.Contains<(typeof rcC)['props'], { updateDefault: unknown }> = 1
    assertRecC

    expect(rcC.props.updateDefault).toStrictEqual({ foo: 'bar' })
  })

  test('returns record with PUT default value if it is not key (default shorthand)', () => {
    const rec = record(fooBar, str).default({ foo: 'foo' })

    const assertRec: A.Contains<(typeof rec)['props'], { putDefault: unknown }> = 1
    assertRec

    expect(rec.props.putDefault).toStrictEqual({ foo: 'foo' })
  })

  test('returns record with KEY default value if it is key (default shorthand)', () => {
    const rec = record(fooBar, str).key().default({ foo: 'foo' })

    const assertRec: A.Contains<(typeof rec)['props'], { keyDefault: unknown }> = 1
    assertRec

    expect(rec.props.keyDefault).toStrictEqual({ foo: 'foo' })
  })

  test('returns linked record (prop)', () => {
    const sayHello = () => ({ hello: 'world' })
    const rcA = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      keyLink: sayHello
    })

    const assertRecA: A.Contains<(typeof rcA)['props'], { keyLink: unknown }> = 1
    assertRecA

    expect(rcA.props.keyLink).toBe(sayHello)

    const rcB = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      putLink: sayHello
    })

    const assertRecB: A.Contains<(typeof rcB)['props'], { putLink: unknown }> = 1
    assertRecB

    expect(rcB.props.putLink).toBe(sayHello)

    const rcC = record(fooBar, str, {
      // TOIMPROVE: Reintroduce type constraints here
      updateLink: sayHello
    })

    const assertRecC: A.Contains<(typeof rcC)['props'], { updateLink: unknown }> = 1
    assertRecC

    expect(rcC.props.updateLink).toBe(sayHello)
  })

  test('returns linked record (method)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rcA = record(fooBar, str).key().keyLink(sayHello)

    const assertRecA: A.Contains<(typeof rcA)['props'], { keyLink: unknown }> = 1
    assertRecA

    expect(rcA.props.keyLink).toBe(sayHello)

    const rcB = record(fooBar, str).putLink(sayHello)

    const assertRecB: A.Contains<(typeof rcB)['props'], { putLink: unknown }> = 1
    assertRecB

    expect(rcB.props.putLink).toBe(sayHello)

    const rcC = record(fooBar, str).updateLink(sayHello)

    const assertRecC: A.Contains<(typeof rcC)['props'], { updateLink: unknown }> = 1
    assertRecC

    expect(rcC.props.updateLink).toBe(sayHello)
  })

  test('returns record with PUT linked value if it is not key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).link(sayHello)

    const assertRec: A.Contains<(typeof rec)['props'], { putLink: unknown }> = 1
    assertRec

    expect(rec.props.putLink).toBe(sayHello)
  })

  test('returns record with KEY linked value if it is key (link shorthand)', () => {
    const sayHello = () => ({ foo: 'hello' })
    const rec = record(fooBar, str).key().link(sayHello)

    const assertRec: A.Contains<(typeof rec)['props'], { keyLink: unknown }> = 1
    assertRec

    expect(rec.props.keyLink).toBe(sayHello)
  })

  test('returns record with validator (prop)', () => {
    // TOIMPROVE: Add type constraints here
    const pass = () => true
    const recordA = record(string(), number(), { keyValidator: pass })
    const recordB = record(string(), number(), { putValidator: pass })
    const recordC = record(string(), number(), { updateValidator: pass })

    const assertRecordA: A.Contains<(typeof recordA)['props'], { keyValidator: Validator }> = 1
    assertRecordA

    expect(recordA.props.keyValidator).toBe(pass)

    const assertRecordB: A.Contains<(typeof recordB)['props'], { putValidator: Validator }> = 1
    assertRecordB

    expect(recordB.props.putValidator).toBe(pass)

    const assertRecordC: A.Contains<(typeof recordC)['props'], { updateValidator: Validator }> = 1
    assertRecordC

    expect(recordC.props.updateValidator).toBe(pass)
  })

  test('returns record with validator (method)', () => {
    const pass = () => true

    const recordA = record(string(), number()).keyValidate(pass)
    const recordB = record(string(), number()).putValidate(pass)
    const recordC = record(string(), number()).updateValidate(pass)

    const assertRecordA: A.Contains<(typeof recordA)['props'], { keyValidator: Validator }> = 1
    assertRecordA

    expect(recordA.props.keyValidator).toBe(pass)

    const assertRecordB: A.Contains<(typeof recordB)['props'], { putValidator: Validator }> = 1
    assertRecordB

    expect(recordB.props.putValidator).toBe(pass)

    const assertRecordC: A.Contains<(typeof recordC)['props'], { updateValidator: Validator }> = 1
    assertRecordC

    expect(recordC.props.updateValidator).toBe(pass)

    const prevRecord = record(string(), number())
    prevRecord.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [{ [x in string]?: number }, typeof prevRecord]> = 1
      assertArgs

      return true
    })

    const prevOptMap = record(string(), number()).optional()
    prevOptMap.validate((...args) => {
      const assertArgs: A.Equals<typeof args, [{ [x in string]?: number }, typeof prevOptMap]> = 1
      assertArgs

      return true
    })
  })

  test('returns record with PUT validator if it is not key (validate shorthand)', () => {
    const pass = () => true
    const _record = record(string(), number()).validate(pass)

    const assertRecord: A.Contains<(typeof _record)['props'], { putValidator: Validator }> = 1
    assertRecord

    expect(_record.props.putValidator).toBe(pass)
  })

  test('returns record with KEY validator if it is key (validate shorthand)', () => {
    const pass = () => true
    const _record = record(string(), number()).key().validate(pass)

    const assertRecord: A.Contains<(typeof _record)['props'], { keyValidator: Validator }> = 1
    assertRecord

    expect(_record.props.keyValidator).toBe(pass)
  })

  test('record of records', () => {
    const rec = record(fooBar, record(fooBar, str))

    const assertRec: A.Contains<
      typeof rec,
      {
        type: 'record'
        keys: Light<typeof fooBar>
        elements: {
          type: 'record'
          keys: Light<typeof fooBar>
          elements: Light<typeof str>
          props: {}
        }
        props: {}
      }
    > = 1
    assertRec
  })
})
