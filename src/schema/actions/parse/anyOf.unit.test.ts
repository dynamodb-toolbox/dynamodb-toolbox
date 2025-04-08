import { DynamoDBToolboxError } from '~/errors/index.js'
import { any, anyOf, map, number, string } from '~/schema/index.js'

import * as schemaParserModule from './schema.js'
import { anyOfSchemaParser } from './anyOf.js'

// @ts-ignore
const schemaParser = vi.spyOn(schemaParserModule, 'schemaParser')

describe('anyOfSchemaParser', () => {
  test('applies validation if any', () => {
    const anyOfA = anyOf(string(), number()).validate(input => typeof input === 'string')

    const { value: parsed } = anyOfSchemaParser(anyOfA, 'foo', { fill: false }).next()
    expect(parsed).toStrictEqual('foo')

    const invalidCallA = () =>
      anyOfSchemaParser(anyOfA, 42, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallA).toThrow(DynamoDBToolboxError)
    expect(invalidCallA).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed."
      })
    )

    const anyOfB = anyOf(string(), number()).validate(input =>
      typeof input === 'string' ? true : 'Oh no...'
    )

    const invalidCallB = () =>
      anyOfSchemaParser(anyOfB, 42, { fill: false, valuePath: ['root'] }).next()

    expect(invalidCallB).toThrow(DynamoDBToolboxError)
    expect(invalidCallB).toThrow(
      expect.objectContaining({
        code: 'parsing.customValidationFailed',
        message: "Custom validation for attribute 'root' failed with message: Oh no...."
      })
    )
  })

  test('applies discriminator if possible', () => {
    schemaParser.mockClear()

    const catSchema = map({ kind: string().const('cat'), meow: any() })
    const dogSchema = map({ kind: string().const('dog'), bark: any() })
    const petSchema = anyOf(catSchema, dogSchema).discriminate('kind')

    const dog = { kind: 'dog', bark: 'waf!' }
    const parser = anyOfSchemaParser(petSchema, dog)

    const { value: defaultedValue } = parser.next()
    expect(defaultedValue).toStrictEqual(dog)

    expect(schemaParser).toHaveBeenCalledTimes(3)
    expect(schemaParser).toHaveBeenCalledWith(dogSchema, dog, {})
    expect(schemaParser).toHaveBeenCalledWith(dogSchema.attributes.kind, 'dog', {
      defined: false,
      fill: true,
      valuePath: ['kind']
    })
    expect(schemaParser).toHaveBeenCalledWith(dogSchema.attributes.bark, 'waf!', {
      defined: false,
      fill: true,
      valuePath: ['bark']
    })
  })
})
