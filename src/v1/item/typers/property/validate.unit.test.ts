import { requiredOptionsSet, Never } from '../constants/requiredOptions'

import { PropertyState } from './interface'
import { validatePropertyState, InvalidPropertyStateError } from './validate'

describe('base state validation', () => {
  const path = 'some/path'

  const validState: PropertyState<Never, false, false, undefined> = {
    _required: 'never',
    _hidden: false,
    _key: false,
    _savedAs: undefined
  }

  it('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    expect(() =>
      validatePropertyState(
        {
          ...validState,
          // @ts-expect-error
          _required: invalidRequiredOption
        },
        path
      )
    ).toThrow(
      new InvalidPropertyStateError({
        optionName: 'required',
        expectedType: [...requiredOptionsSet].join(', '),
        receivedValue: invalidRequiredOption,
        path
      })
    )

    expect(() => validatePropertyState(validState)).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _required: 'atLeastOnce' })).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _required: 'onlyOnce' })).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _required: 'always' })).not.toThrow()
  })

  it('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validatePropertyState(
        {
          ...validState,
          // @ts-expect-error
          _hidden: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidPropertyStateError({
        optionName: 'hidden',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validatePropertyState(validState)).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _hidden: true })).not.toThrow()
  })

  it('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validatePropertyState(
        {
          ...validState,
          // @ts-expect-error
          _key: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidPropertyStateError({
        optionName: 'key',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validatePropertyState(validState)).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _key: true })).not.toThrow()
  })

  it('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    expect(() =>
      validatePropertyState(
        {
          ...validState,
          // @ts-expect-error
          _savedAs: invalidSavedAsOption
        },
        path
      )
    ).toThrow(
      new InvalidPropertyStateError({
        optionName: 'savedAs',
        expectedType: 'string',
        receivedValue: invalidSavedAsOption,
        path
      })
    )

    expect(() => validatePropertyState(validState)).not.toThrow()
    expect(() => validatePropertyState({ ...validState, _savedAs: 'foo' })).not.toThrow()
  })
})
