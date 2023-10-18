import { DynamoDBToolboxError } from 'v1/errors'

import type { Never } from '../constants/requiredOptions'
import { $required, $hidden, $key, $savedAs, $defaults } from '../constants/attributeOptions'

import type { $SharedAttributeState } from './interface'
import { validateAttributeProperties } from './validate'

describe('shared properties validation', () => {
  const path = 'some/path'

  const validProperties: $SharedAttributeState<{
    required: Never
    hidden: false
    key: false
    savedAs: undefined
    defaults: {
      key: undefined
      put: undefined
      update: undefined
    }
  }> = {
    [$required]: 'never',
    [$hidden]: false,
    [$key]: false,
    [$savedAs]: undefined,
    [$defaults]: {
      key: undefined,
      put: undefined,
      update: undefined
    }
  }

  it('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$required]: invalidRequiredOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$required]: 'atLeastOnce' }, path)
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$required]: 'always' }, path)
    ).not.toThrow()
  })

  it('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$hidden]: invalidKeyOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$hidden]: true }, path)
    ).not.toThrow()
  })

  it('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$key]: invalidKeyOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$key]: true }, path)
    ).not.toThrow()
  })

  it('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          [$savedAs]: invalidSavedAsOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, [$savedAs]: 'foo' }, path)
    ).not.toThrow()
  })
})
