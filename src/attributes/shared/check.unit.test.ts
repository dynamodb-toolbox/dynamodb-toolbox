import { DynamoDBToolboxError } from '~/errors/index.js'

import { checkSchemaProps } from './check.js'
import type { SchemaProps } from './props.js'

describe('shared props validation', () => {
  const path = 'some/path'

  const validProperties: SchemaProps = { required: 'never' }

  test('throws if required option is invalid', () => {
    const invalidRequiredOption = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
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

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() =>
      checkSchemaProps({ ...validProperties, required: 'atLeastOnce' }, path)
    ).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, required: 'always' }, path)).not.toThrow()
  })

  test('throws if hidden option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
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

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, hidden: true }, path)).not.toThrow()
  })

  test('throws if key option is invalid', () => {
    const invalidKeyOption = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
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

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, key: true }, path)).not.toThrow()
  })

  test('throws if savedAs option is invalid', () => {
    const invalidSavedAsOption = 42

    const invalidCall = () =>
      checkSchemaProps(
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

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, savedAs: 'foo' }, path)).not.toThrow()
  })
})
