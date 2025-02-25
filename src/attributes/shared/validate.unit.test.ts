import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SharedAttributeState } from './interface.js'
import { validateAttributeProperties } from './validate.js'

describe('shared properties validation', () => {
  const path = 'some/path'

  const validProperties: SharedAttributeState = { required: 'never' }

  test('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          required: invalidRequiredOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, required: 'atLeastOnce' }, path)
    ).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, required: 'always' }, path)
    ).not.toThrow()
  })

  test('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          hidden: invalidKeyOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, hidden: true }, path)
    ).not.toThrow()
  })

  test('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          key: invalidKeyOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() => validateAttributeProperties({ ...validProperties, key: true }, path)).not.toThrow()
  })

  test('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    const invalidCall = () =>
      validateAttributeProperties(
        {
          ...validProperties,
          // @ts-expect-error
          savedAs: invalidSavedAsOption
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(
      expect.objectContaining({ code: 'schema.attribute.invalidProperty', path })
    )

    expect(() => validateAttributeProperties(validProperties, path)).not.toThrow()
    expect(() =>
      validateAttributeProperties({ ...validProperties, savedAs: 'foo' }, path)
    ).not.toThrow()
  })
})
