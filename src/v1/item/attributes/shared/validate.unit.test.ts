import { requiredOptionsSet, Never } from '../constants/requiredOptions'

import { _AttributeProperties } from './interface'
import { validateAttributeProperties, InvalidAttributePropertyError } from './validate'

describe('shared properties validation', () => {
  const path = 'some/path'

  const validProperties: _AttributeProperties<Never, false, false, undefined> = {
    _required: 'never',
    _hidden: false,
    _key: false,
    _savedAs: undefined
  }

  it('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          _required: invalidRequiredOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributePropertyError({
        propertyName: 'required',
        expectedType: [...requiredOptionsSet].join(', '),
        receivedValue: invalidRequiredOption,
        path
      })
    )

    expect(() => validateAttributeProperties(validProperties)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, _required: 'atLeastOnce' })
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, _required: 'onlyOnce' })
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, _required: 'always' })
    ).not.toThrow()
  })

  it('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          _hidden: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributePropertyError({
        propertyName: 'hidden',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validateAttributeProperties(validProperties)).not.toThrow()
    expect(() => validateAttributeProperties({ ...validProperties, _hidden: true })).not.toThrow()
  })

  it('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          _key: invalidKeyOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributePropertyError({
        propertyName: 'key',
        expectedType: 'boolean',
        receivedValue: invalidKeyOption,
        path
      })
    )

    expect(() => validateAttributeProperties(validProperties)).not.toThrow()
    expect(() => validateAttributeProperties({ ...validProperties, _key: true })).not.toThrow()
  })

  it('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          _savedAs: invalidSavedAsOption
        },
        path
      )
    ).toThrow(
      new InvalidAttributePropertyError({
        propertyName: 'savedAs',
        expectedType: 'string',
        receivedValue: invalidSavedAsOption,
        path
      })
    )

    expect(() => validateAttributeProperties(validProperties)).not.toThrow()
    expect(() => validateAttributeProperties({ ...validProperties, _savedAs: 'foo' })).not.toThrow()
  })
})
