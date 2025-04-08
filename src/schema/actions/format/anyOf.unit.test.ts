import { DynamoDBToolboxError } from '~/errors/index.js'
import { any, anyOf, map, number, string } from '~/schema/index.js'

import * as schemaFormatterModule from './schema.js'
import { anyOfSchemaFormatter } from './anyOf.js'

// @ts-ignore
const schemaFormatter = vi.spyOn(schemaFormatterModule, 'schemaFormatter')

describe('anyOfSchemaFormatter', () => {
  test('throws if value is invalid', () => {
    const schema = anyOf(number(), string())

    const invalidCall = () => anyOfSchemaFormatter(schema, true).next()

    expect(invalidCall).toThrow(DynamoDBToolboxError)
    expect(invalidCall).toThrow(expect.objectContaining({ code: 'formatter.invalidAttribute' }))
  })

  test('returns value if it is valid', () => {
    const anyOfA = anyOf(number(), string())

    const formatter = anyOfSchemaFormatter(anyOfA, 'foo')

    const { value: transformedValue } = formatter.next()
    expect(transformedValue).toBe('foo')

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  test('does not transform is transform is false', () => {
    const anyOfA = anyOf(string(), number())

    const formatter = anyOfSchemaFormatter(anyOfA, 'foo', { transform: false })

    const { done, value: formattedValue } = formatter.next()
    expect(formattedValue).toBe('foo')
    expect(done).toBe(true)
  })

  // TODO: Apply validation

  describe('Discrimination', () => {
    const catSchema = map({ kind: string().const('cat').savedAs('k'), meow: any() })
    const dogSchema = map({ kind: string().const('dog').savedAs('k'), bark: any() })
    const petSchema = anyOf(catSchema, dogSchema).discriminate('kind')

    beforeEach(() => {
      schemaFormatter.mockClear()
    })

    it('applies discriminator if possible (transformed)', () => {
      const dog = { k: 'dog', bark: 'waf!' }
      const formatter = anyOfSchemaFormatter(petSchema, dog)

      const { value: formattedValue } = formatter.next()
      expect(formattedValue).toStrictEqual({ kind: 'dog', bark: 'waf!' })

      expect(schemaFormatter).toHaveBeenCalledTimes(3)
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema, dog, {})
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema.attributes.kind, 'dog', {
        valuePath: ['k']
      })
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema.attributes.bark, 'waf!', {
        valuePath: ['bark']
      })
    })

    it('applies discriminator if possible (not transformed)', () => {
      const dog = { kind: 'dog', bark: 'waf!' }
      const formatter = anyOfSchemaFormatter(petSchema, dog, { transform: false })

      const { value: formattedValue } = formatter.next()
      expect(formattedValue).toStrictEqual(dog)

      expect(schemaFormatter).toHaveBeenCalledTimes(3)
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema, dog, { transform: false })
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema.attributes.kind, 'dog', {
        valuePath: ['kind'],
        transform: false
      })
      expect(schemaFormatter).toHaveBeenCalledWith(dogSchema.attributes.bark, 'waf!', {
        valuePath: ['bark'],
        transform: false
      })
    })
  })
})
