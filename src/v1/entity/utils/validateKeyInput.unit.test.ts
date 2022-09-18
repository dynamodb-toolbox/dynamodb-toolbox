import { any, binary, boolean, list, map, number, string } from 'v1/item'

import {
  validateKeyInput,
  UnrecognizedKeyInputPropertyError,
  InvalidKeyInputValueTypeError
} from './validateKeyInput'

describe('validateKeyInput', () => {
  const path = 'some.path'

  describe('any', () => {
    const input = ['any', { value: 'that you want' }]

    it('passes if attribute is key', () => {
      expect(() => validateKeyInput(any().key(), input, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(any(), input, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })
  })

  describe('binary', () => {
    const keyBin = binary().key()
    const validInput = Buffer.from('toto')
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(keyBin, validInput, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(binary(), validInput, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyBin, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'binary',
          keyInput: invalidInput,
          path
        })
      )
    })
  })

  describe('boolean', () => {
    const keyBool = boolean().key()
    const validInput = true
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(keyBool, validInput, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(boolean(), validInput, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyBool, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'boolean',
          keyInput: invalidInput,
          path
        })
      )
    })
  })

  describe('numbers', () => {
    const keyNum = number().key()
    const validInput = 42
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(keyNum, validInput, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(number(), validInput, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyNum, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({ expectedType: 'number', keyInput: invalidInput, path })
      )
    })
  })

  describe('strings', () => {
    const keyStr = string().key()
    const validInput = 'foo'
    const invalidInput = 42

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(keyStr, validInput, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(string(), validInput, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyStr, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({ expectedType: 'string', keyInput: invalidInput, path })
      )
    })
  })

  describe('lists', () => {
    const stringList = list(string().required().key()).key()
    const validInput = ['foo']
    const invalidInput = ['foo', 42]

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(stringList, validInput, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(list(string().required()), validInput, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(stringList, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'string',
          keyInput: invalidInput[1],
          path: `${path}[1]`
        })
      )
    })
  })

  describe('maps', () => {
    const keyMap = map({
      keyStr: string().required('always').key(),
      optStr: string().key(),
      nonKeyStr: string().required('always')
    }).key()
    const invalidInput = { keyStr: 42 }
    const validInput1 = { keyStr: 'foo' }
    const validInput2 = { keyStr: 'foo', optStr: 'bar' }

    it('passes if attribute is key and input is valid (without optional attribute)', () => {
      expect(() => validateKeyInput(keyMap, validInput1, path)).not.toThrow()
    })

    it('passes if attribute is key and input is valid (with optional attribute)', () => {
      expect(() => validateKeyInput(keyMap, validInput2, path)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(map({ keyStr: string() }), validInput1, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path })
      )
    })

    it('throws if input is invalid', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyMap, invalidInput, path)).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'string',
          keyInput: invalidInput.keyStr,
          path: `${path}.keyStr`
        })
      )
    })

    it('rejects additional attributes if closed', () => {
      // @ts-expect-error
      expect(() => validateKeyInput(keyMap, { ...validInput2, nonKeyStr: 'baz' }, path)).toThrow(
        new UnrecognizedKeyInputPropertyError({ path: `${path}.nonKeyStr` })
      )
    })

    it('accepts additional attributes if open', () => {
      expect(() =>
        validateKeyInput(keyMap.open(), { ...validInput2, anyProp: 'baz' }, path)
      ).not.toThrow()
    })
  })
})
