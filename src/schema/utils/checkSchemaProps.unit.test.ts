import { DynamoDBToolboxError } from '~/errors/index.js'

import type { SchemaProps } from '../types/index.js'
import { checkSchemaProps } from './checkSchemaProps.js'

describe('schema props validation', () => {
  const path = 'some/path'

  const validProperties: SchemaProps = { required: 'never' }

  test('throws if required prop is invalid', () => {
    const invalidRequiredProp = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
        {
          ...validProperties,
          // @ts-expect-error
          required: invalidRequiredProp
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.invalidProp', path }))

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() =>
      checkSchemaProps({ ...validProperties, required: 'atLeastOnce' }, path)
    ).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, required: 'always' }, path)).not.toThrow()
  })

  test('throws if hidden prop is invalid', () => {
    const invalidKeyProp = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
        {
          ...validProperties,
          // @ts-expect-error
          hidden: invalidKeyProp
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.invalidProp', path }))

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, hidden: true }, path)).not.toThrow()
  })

  test('throws if key prop is invalid', () => {
    const invalidKeyProp = 'invalid'

    const invalidCall = () =>
      checkSchemaProps(
        {
          ...validProperties,
          // @ts-expect-error
          key: invalidKeyProp
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.invalidProp', path }))

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, key: true }, path)).not.toThrow()
  })

  test('throws if savedAs prop is invalid', () => {
    const invalidSavedAsProp = 42

    const invalidCall = () =>
      checkSchemaProps(
        {
          ...validProperties,
          // @ts-expect-error
          savedAs: invalidSavedAsProp
        },
        path
      )

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'schema.invalidProp', path }))

    expect(() => checkSchemaProps(validProperties, path)).not.toThrow()
    expect(() => checkSchemaProps({ ...validProperties, savedAs: 'foo' }, path)).not.toThrow()
  })
})
