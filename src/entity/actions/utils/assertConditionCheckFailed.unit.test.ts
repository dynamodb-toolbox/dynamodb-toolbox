import { ConditionalCheckFailedException } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import type { A } from 'ts-toolbelt'
import type { MockInstance } from 'vitest'

import { Entity, Table, assertConditionCheckFailed, item, number, string } from '~/index.js'

import type { ConditionCheckFailedError } from './isConditionCheckFailed.js'

const TestTable = new Table({
  name: 'test-table',
  partitionKey: { type: 'string', name: 'pk' }
})

const PokemonEntity = new Entity({
  name: 'Pokemon',
  schema: item({
    pokemonId: string().key().savedAs('pk'),
    level: number(),
    name: string().optional()
  }),
  table: TestTable,
  timestamps: false
})

const savedPokemon = { pk: 'pikachu', _et: 'Pokemon', level: 12, name: 'Pikachu' }
const formattedPokemon = { pokemonId: 'pikachu', level: 12, name: 'Pikachu' }

const conditionCheckFailedException = (
  item?: Record<string, unknown>
): ConditionCheckFailedError<typeof PokemonEntity> => {
  const exception: ConditionCheckFailedError<typeof PokemonEntity> =
    new ConditionalCheckFailedException({
      message: 'The conditional request failed',
      $metadata: {}
    })

  if (item !== undefined) {
    exception.Item = marshall(item)
  }

  return exception
}

describe('assertConditionCheckFailed', () => {
  let buildSpy: MockInstance

  beforeAll(() => {
    buildSpy = vi.spyOn(PokemonEntity, 'build')
  })

  beforeEach(() => {
    buildSpy.mockClear()
  })

  afterAll(() => {
    buildSpy.mockRestore()
  })

  test('re-throws the same instance for a non-condition error', () => {
    const throttlingError = Object.assign(new Error('Rate exceeded'), {
      name: 'ThrottlingException'
    })

    expect(() => assertConditionCheckFailed(throttlingError, PokemonEntity)).toThrow(
      throttlingError
    )
  })

  test('augments a condition-check failure carrying an Item and does not throw', () => {
    const error = conditionCheckFailedException(savedPokemon)

    assertConditionCheckFailed(error, PokemonEntity)

    expect(error.FormattedItem).toStrictEqual(formattedPokemon)

    const assertNarrowed: A.Equals<
      typeof error,
      ConditionCheckFailedError<typeof PokemonEntity>
    > = 1
    assertNarrowed
  })

  test('does not re-format an already-augmented error', () => {
    const error = conditionCheckFailedException(savedPokemon)

    assertConditionCheckFailed(error, PokemonEntity)
    assertConditionCheckFailed(error, PokemonEntity)

    expect(buildSpy).toHaveBeenCalledOnce()
  })

  test('leaves FormattedItem undefined when no Item is carried', () => {
    const error = conditionCheckFailedException()

    assertConditionCheckFailed(error, PokemonEntity)
    expect(error.FormattedItem).toBeUndefined()
  })

  test('leaves FormattedItem undefined when the item cannot be formatted (fallback)', () => {
    const error = conditionCheckFailedException({ pk: 'pikachu', foo: 'bar' })

    assertConditionCheckFailed(error, PokemonEntity)
    expect(error.FormattedItem).toBeUndefined()
  })

  test('does not augment when no entity is provided', () => {
    const error = conditionCheckFailedException(savedPokemon)

    assertConditionCheckFailed(error)

    expect(error.FormattedItem).toBeUndefined()
  })
})
