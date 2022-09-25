import { requiredOptionsSet, Never } from '../constants/requiredOptions'

import { AttributeState } from './interface'
import { validateAttributeState, InvalidAttributeStateError } from './validate'

describe('base state validation', () => {
  const path = 'some/path'

  const validState: AttributeState<Never, false, false, undefined> = {
    _required: 'never',
    _hidden: false,
    _key: false,
    _savedAs: undefined
  }

  it('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    expect(() =>
      validateAttributeState(
        {
          ...validState,
          // @ts-expect-error
          _required: invalidRequiredOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributeStateError({
        optionName: 'required',
        expectedType: [...requiredOptionsSet].join(', '),
        receivedValue: invalidRequiredOption,
        path
      })
    )

    expect(() => validateAttributeState(validState)).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _required: 'atLeastOnce' })).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _required: 'onlyOnce' })).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _required: 'always' })).not.toThrow()
  })

  it('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeState(
        {
          ...validState,
          // @ts-expect-error
          _hidden: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributeStateError({
        optionName: 'hidden',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validateAttributeState(validState)).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _hidden: true })).not.toThrow()
  })

  it('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeState(
        {
          ...validState,
          // @ts-expect-error
          _key: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributeStateError({
        optionName: 'key',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validateAttributeState(validState)).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _key: true })).not.toThrow()
  })

  it('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    expect(() =>
      validateAttributeState(
        {
          ...validState,
          // @ts-expect-error
          _savedAs: invalidSavedAsOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributeStateError({
        optionName: 'savedAs',
        expectedType: 'string',
        receivedValue: invalidSavedAsOption,
        path
      })
    )

    expect(() => validateAttributeState(validState)).not.toThrow()
    expect(() => validateAttributeState({ ...validState, _savedAs: 'foo' })).not.toThrow()
  })
})
