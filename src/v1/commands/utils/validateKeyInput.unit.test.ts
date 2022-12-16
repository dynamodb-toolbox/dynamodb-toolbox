import { any, binary, boolean, list, map, number, string } from 'v1/item'
import { freezeAttribute } from 'v1/item/attributes/freeze'

import {
  validateKeyInput,
  UnrecognizedKeyInputAttributeError,
  InvalidKeyInputValueTypeError
} from './validateKeyInput'

describe('validateKeyInput', () => {
  const path = 'some.path'

  describe('any', () => {
    const input = ['any', { value: 'that you want' }]

    it('passes if attribute is key', () => {
      expect(() => validateKeyInput(freezeAttribute(any().key(), path), input)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(freezeAttribute(any(), path), input)).toThrow(
        new UnrecognizedKeyInputAttributeError({ path })
      )
    })
  })

  describe('binary', () => {
    const keyBin = binary().key()
    const validInput = Buffer.from('toto')
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(freezeAttribute(keyBin, path), validInput)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(freezeAttribute(binary(), path), validInput)).toThrow(
        new UnrecognizedKeyInputAttributeError({ path })
      )
    })

    it('throws if input is invalid', () => {
      expect(() =>
        validateKeyInput(
          freezeAttribute(keyBin, path),
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'binary',
          keyInput: invalidInput,
          path,
          context: {}
        })
      )
    })
  })

  describe('boolean', () => {
    const keyBool = boolean().key()
    const validInput = true
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(freezeAttribute(keyBool, path), validInput)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(freezeAttribute(boolean(), path), validInput)).toThrow(
        new UnrecognizedKeyInputAttributeError({ path })
      )
    })

    it('throws if input is invalid', () => {
      expect(() =>
        validateKeyInput(
          freezeAttribute(keyBool, path),
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'boolean',
          keyInput: invalidInput,
          path,
          context: {}
        })
      )
    })
  })

  describe('numbers', () => {
    const keyNum = number().key()
    const validInput = 42
    const invalidInput = 'some string'

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(freezeAttribute(keyNum, path), validInput)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(freezeAttribute(number(), path), validInput)).toThrow(
        new UnrecognizedKeyInputAttributeError({ path })
      )
    })

    it('throws if input is invalid', () => {
      expect(() =>
        validateKeyInput(
          freezeAttribute(keyNum, path),
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'number',
          keyInput: invalidInput,
          path,
          context: {}
        })
      )
    })
  })

  describe('strings', () => {
    const keyStr = string().key()
    const validInput = 'foo'
    const invalidInput = 42

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(freezeAttribute(keyStr, path), validInput)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() => validateKeyInput(freezeAttribute(string(), path), validInput)).toThrow(
        new UnrecognizedKeyInputAttributeError({ path })
      )
    })

    it('throws if input is invalid', () => {
      expect(() =>
        validateKeyInput(
          freezeAttribute(keyStr, path),
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'string',
          keyInput: invalidInput,
          path,
          context: {}
        })
      )
    })
  })

  describe('lists', () => {
    const _stringList = list(string().required().key()).key()
    const stringList = freezeAttribute(_stringList, path)
    const validInput = ['foo']
    const invalidInput = ['foo', 42]

    it('passes if attribute is key and input is valid', () => {
      expect(() => validateKeyInput(stringList, validInput)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() =>
        validateKeyInput(freezeAttribute(list(string().required()), path), validInput)
      ).toThrow(new UnrecognizedKeyInputAttributeError({ path }))
    })

    it('throws if input is invalid', () => {
      const expectedError = new InvalidKeyInputValueTypeError({
        expectedType: 'string',
        keyInput: invalidInput[1],
        path: stringList.elements.path,
        context: { elementsIndexes: [1] }
      })

      expect(() =>
        validateKeyInput(
          stringList,
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(expectedError)

      expect(expectedError.message).toStrictEqual(
        'Invalid key input value type at path some.path[1]. Expected: string. Received: 42.'
      )
    })

    it('throws valid error message even in nested lists', () => {
      const stringListOfList = freezeAttribute(
        list(list(string().required().key()).required().key()).key(),
        path
      )
      const invalidListOfList = [['foo'], ['foo', 'bar', 42]]

      const expectedError = new InvalidKeyInputValueTypeError({
        expectedType: 'string',
        keyInput: invalidListOfList[1][2],
        path: stringListOfList.elements.elements.path,
        context: { elementsIndexes: [1, 2] }
      })

      expect(() =>
        validateKeyInput(
          stringListOfList,
          // @ts-expect-error
          invalidListOfList
        )
      ).toThrow(expectedError)

      expect(expectedError.message).toStrictEqual(
        'Invalid key input value type at path some.path[1][2]. Expected: string. Received: 42.'
      )
    })
  })

  describe('maps', () => {
    const _keyMap = map({
      keyStr: string().required('always').key(),
      optStr: string().key(),
      nonKeyStr: string().required('always')
    }).key()
    const keyMap = freezeAttribute(_keyMap, path)
    const invalidInput = { keyStr: 42 }
    const validInput1 = { keyStr: 'foo' }
    const validInput2 = { keyStr: 'foo', optStr: 'bar' }

    it('passes if attribute is key and input is valid (without optional attribute)', () => {
      expect(() => validateKeyInput(keyMap, validInput1)).not.toThrow()
    })

    it('passes if attribute is key and input is valid (with optional attribute)', () => {
      expect(() => validateKeyInput(keyMap, validInput2)).not.toThrow()
    })

    it('throws if attribute is not key', () => {
      expect(() =>
        validateKeyInput(freezeAttribute(map({ keyStr: string() }), path), validInput1)
      ).toThrow(new UnrecognizedKeyInputAttributeError({ path }))
    })

    it('throws if input is invalid', () => {
      expect(() =>
        validateKeyInput(
          keyMap,
          // @ts-expect-error
          invalidInput
        )
      ).toThrow(
        new InvalidKeyInputValueTypeError({
          expectedType: 'string',
          keyInput: invalidInput.keyStr,
          path: `${path}.keyStr`,
          context: {}
        })
      )
    })

    it('rejects additional attributes if closed', () => {
      expect(() =>
        validateKeyInput(keyMap, {
          ...validInput2,
          // @ts-expect-error
          nonKeyStr: 'baz'
        })
      ).toThrow(new UnrecognizedKeyInputAttributeError({ path: `${path}.nonKeyStr` }))
    })

    it('accepts additional attributes if open', () => {
      expect(() =>
        validateKeyInput(freezeAttribute(_keyMap.open(), path), { ...validInput2, anyProp: 'baz' })
      ).not.toThrow()
    })
  })
})
