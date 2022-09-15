import { any, binary, boolean, list, map, number, string } from 'v1/item'

import {
  validateKeyInput,
  UnrecognizedKeyInputPropertyError,
  InvalidKeyInputValueTypeError
} from './validateKeyInput'

describe('validateKeyInput', () => {
  const path = 'some.path'

  it('always validates key any', () => {
    const input = ['any', { value: 'that you want' }]

    expect(() => validateKeyInput(any(), input, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    expect(() => validateKeyInput(any().key(), input, path)).not.toThrow()
  })

  it('validates valid key binaries', () => {
    const validInput = Buffer.from('toto')

    expect(() => validateKeyInput(binary(), validInput, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const keyBin = binary().key()
    expect(() => validateKeyInput(keyBin, validInput, path)).not.toThrow()

    const invalidInput = 'some string'
    // @ts-expect-error
    expect(() => validateKeyInput(keyBin, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({ expectedType: 'binary', keyInput: invalidInput, path })
    )
  })

  it('validates valid key booleans', () => {
    const validInput = true

    expect(() => validateKeyInput(boolean(), validInput, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const keyBool = boolean().key()
    expect(() => validateKeyInput(keyBool, validInput, path)).not.toThrow()

    const invalidInput = 'some string'
    // @ts-expect-error
    expect(() => validateKeyInput(keyBool, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({ expectedType: 'boolean', keyInput: invalidInput, path })
    )
  })

  it('validates valid key numbers', () => {
    const validInput = 42

    expect(() => validateKeyInput(number(), validInput, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const keyNum = number().key()
    expect(() => validateKeyInput(keyNum, validInput, path)).not.toThrow()

    const invalidInput = 'some string'
    // @ts-expect-error
    expect(() => validateKeyInput(keyNum, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({ expectedType: 'number', keyInput: invalidInput, path })
    )
  })

  it('validates valid key strings', () => {
    const validInput = 'foo'

    expect(() => validateKeyInput(string(), validInput, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const keyStr = string().key()
    expect(() => validateKeyInput(keyStr, validInput, path)).not.toThrow()

    const invalidInput = 42
    // @ts-expect-error
    expect(() => validateKeyInput(keyStr, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({ expectedType: 'string', keyInput: invalidInput, path })
    )
  })

  it('validates valid key lists', () => {
    const validInput = ['foo']

    expect(() => validateKeyInput(list(string().required()), validInput, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const stringList = list(string().required().key()).key()
    expect(() => validateKeyInput(stringList, validInput, path)).not.toThrow()

    // throw if element is invalid
    const invalidInput = ['foo', 42]
    // @ts-expect-error
    expect(() => validateKeyInput(stringList, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({
        expectedType: 'string',
        keyInput: invalidInput[1],
        path: `${path}[1]`
      })
    )
  })

  it('validates valid key maps', () => {
    const invalidInput = { keyStr: 42 }
    const validInput1 = { keyStr: 'foo' }
    const validInput2 = { keyStr: 'foo', optStr: 'bar' }

    expect(() => validateKeyInput(map({ keyStr: string() }), validInput1, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path })
    )

    const keyMap = map({
      keyStr: string().required('always').key(),
      optStr: string().key(),
      nonKeyStr: string().required('always')
    }).key()

    // Without optional properties
    expect(() => validateKeyInput(keyMap, validInput1, path)).not.toThrow()

    // With optional properties
    expect(() => validateKeyInput(keyMap, validInput2, path)).not.toThrow()

    // Rejects other properties
    // @ts-expect-error
    expect(() => validateKeyInput(keyMap, { ...validInput2, nonKeyStr: 'baz' }, path)).toThrow(
      new UnrecognizedKeyInputPropertyError({ path: `${path}.nonKeyStr` })
    )

    // Fail if property is invalid
    // @ts-expect-error
    expect(() => validateKeyInput(keyMap, invalidInput, path)).toThrow(
      new InvalidKeyInputValueTypeError({
        expectedType: 'string',
        keyInput: invalidInput.keyStr,
        path: `${path}.keyStr`
      })
    )

    // ...except if map is open
    expect(() =>
      validateKeyInput(keyMap.open(), { ...validInput2, anyProp: 'baz' }, path)
    ).not.toThrow()
  })
})
