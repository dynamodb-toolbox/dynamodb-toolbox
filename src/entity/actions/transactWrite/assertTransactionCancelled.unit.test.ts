import { TransactionCanceledException } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import type { A } from 'ts-toolbelt'
import type { MockInstance } from 'vitest'

import {
  Entity,
  PutTransaction,
  Table,
  assertTransactionCancelled,
  item,
  number,
  string
} from '~/index.js'
import type { Writable } from '~/types/writable.js'

import type { TransactionCancelledError } from './isTransactionCancelled.js'

const PokemonTable = new Table({
  name: 'pokemons',
  partitionKey: { type: 'string', name: 'pk' }
})

const PokemonEntity = new Entity({
  name: 'Pokemon',
  schema: item({
    pokemonId: string().key().savedAs('pk'),
    level: number(),
    name: string().optional()
  }),
  table: PokemonTable,
  timestamps: false
})

const savedPokemon = { pk: 'pikachu', _et: 'Pokemon', level: 12, name: 'Pikachu' }
const formattedPokemon = { pokemonId: 'pikachu', level: 12, name: 'Pikachu' }

const transactionCanceledException = (
  reasons?: { Code: string; Item?: Record<string, unknown> }[]
) => {
  const exception = new TransactionCanceledException({
    message: 'Transaction cancelled',
    $metadata: {}
  })

  if (reasons !== undefined) {
    exception.CancellationReasons = reasons.map(({ Code, Item }) => ({
      Code,
      ...(Item !== undefined ? { Item: marshall(Item) } : {})
    }))
  }

  return exception
}

describe('assertTransactionCancelled', () => {
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

  test('re-throws the same instance for a non-transaction error', () => {
    const throttlingError = Object.assign(new Error('Rate exceeded'), {
      name: 'ThrottlingException'
    })

    expect(() => assertTransactionCancelled(throttlingError)).toThrow(throttlingError)
  })

  test('augments each reason carrying an Item and does not throw', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ] as const

    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: savedPokemon }
    ])

    assertTransactionCancelled(error, ...transactions)

    expect(error.CancellationReasons?.[0]?.FormattedItem).toStrictEqual(formattedPokemon)

    const assertNarrowed: A.Equals<
      typeof error,
      TransactionCancelledError<Writable<typeof transactions>>
    > = 1
    assertNarrowed
  })

  test('leaves Code: "None" reasons untouched', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ] as const

    const error = transactionCanceledException([{ Code: 'None' }])

    assertTransactionCancelled(error, ...transactions)

    expect(error.CancellationReasons?.[0]?.FormattedItem).toBeUndefined()
  })

  test('does not re-format an already-augmented reason', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ]

    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: savedPokemon }
    ])

    buildSpy.mockClear()

    assertTransactionCancelled(error, ...transactions)
    assertTransactionCancelled(error, ...transactions)

    expect(buildSpy).toHaveBeenCalledOnce()
  })
})
