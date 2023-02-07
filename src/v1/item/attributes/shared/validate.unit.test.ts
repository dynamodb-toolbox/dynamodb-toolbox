import { requiredOptionsSet, Never } from '../constants/requiredOptions'
import { $required, $hidden, $key, $savedAs } from '../constants/attributeOptions'

import { $AttributeSharedState } from './interface'
import { validateAttributeProperties, InvalidAttributePropertyError } from './validate'

describe('shared properties validation', () => {
  const path = 'some/path'

  const validProperties: $AttributeSharedState<{
    [$required]: Never
    [$hidden]: false
    [$key]: false
    [$savedAs]: undefined
  }> = {
    [$required]: 'never',
    [$hidden]: false,
    [$key]: false,
    [$savedAs]: undefined
  }

  it('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$required]: invalidRequiredOption
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

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$required]: 'atLeastOnce' }, path)
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$required]: 'onlyOnce' }, path)
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$required]: 'always' }, path)
    ).not.toThrow()
  })

  it('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$hidden]: invalidKeyOption
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

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$hidden]: true }, path)
    ).not.toThrow()
  })

  it('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$key]: invalidKeyOption
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

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$key]: true }, path)
    ).not.toThrow()
  })

  it('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    expect(() =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$savedAs]: invalidSavedAsOption
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

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$savedAs]: 'foo' }, path)
    ).not.toThrow()
  })
})
