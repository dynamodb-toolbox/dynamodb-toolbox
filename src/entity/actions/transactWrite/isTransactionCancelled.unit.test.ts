import { TransactionCanceledException } from '@aws-sdk/client-dynamodb'
import { marshall } from '@aws-sdk/util-dynamodb'
import type { A } from 'ts-toolbelt'
import type { MockInstance } from 'vitest'

import {
  ConditionCheck,
  Entity,
  PutTransaction,
  Table,
  isTransactionCancelled,
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

const TrainerTable = new Table({
  name: 'trainers',
  partitionKey: { type: 'string', name: 'pk' }
})

const TrainerEntity = new Entity({
  name: 'Trainer',
  schema: item({
    trainerId: string().key().savedAs('pk'),
    town: string()
  }),
  table: TrainerTable,
  timestamps: false
})

const savedPokemon = { pk: 'pikachu', _et: 'Pokemon', level: 12, name: 'Pikachu' }
const formattedPokemon = { pokemonId: 'pikachu', level: 12, name: 'Pikachu' }
const savedTrainer = { pk: 'ash', _et: 'Trainer', town: 'Pallet' }
const formattedTrainer = { trainerId: 'ash', town: 'Pallet' }

const transactionCanceledException = (
  reasons?: { Code: string; Item?: Record<string, unknown> }[]
): TransactionCancelledError => {
  const exception: TransactionCancelledError = new TransactionCanceledException({
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

describe('isTransactionCancelled', () => {
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

  test('returns false for any other error', () => {
    const throttlingError = Object.assign(new Error('Rate exceeded'), {
      name: 'ThrottlingException'
    })

    expect(isTransactionCancelled(throttlingError)).toBe(false)
  })

  test('augments each reason with its positional entity and returns true', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 }),
      TrainerEntity.build(ConditionCheck)
        .key({ trainerId: 'ash' })
        .condition({ attr: 'town', exists: true }),
      TrainerEntity.build(PutTransaction).item({ trainerId: 'ash', town: 'Pallet' })
    ] as const

    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: savedPokemon },
      { Code: 'None' },
      { Code: 'ConditionalCheckFailed', Item: savedTrainer }
    ])

    const isTxCancelled = isTransactionCancelled(error, ...transactions)

    expect(isTxCancelled).toBe(true)
    expect(error.CancellationReasons?.[0]?.FormattedItem).toStrictEqual(formattedPokemon)
    expect(error.CancellationReasons?.[1]?.FormattedItem).toBeUndefined()
    expect(error.CancellationReasons?.[2]?.FormattedItem).toStrictEqual(formattedTrainer)

    if (isTxCancelled) {
      const assertNarrowed: A.Equals<
        typeof error,
        TransactionCancelledError<Writable<typeof transactions>>
      > = 1
      assertNarrowed
    }
  })

  test('does not re-format an already-augmented reason', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ]

    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: savedPokemon }
    ])

    // 👇 ignore the `build` call made while constructing the transaction above
    buildSpy.mockClear()

    isTransactionCancelled(error, ...transactions)
    isTransactionCancelled(error, ...transactions)

    expect(buildSpy).toHaveBeenCalledOnce()
  })

  test('leaves FormattedItem undefined when a reason carries no Item', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ]

    const error = transactionCanceledException([{ Code: 'ConditionalCheckFailed' }])

    isTransactionCancelled(error, ...transactions)
    expect(error.CancellationReasons?.[0]?.FormattedItem).toBeUndefined()
  })

  test('leaves FormattedItem undefined when the item cannot be formatted (fallback)', () => {
    const transactions = [
      PokemonEntity.build(PutTransaction).item({ pokemonId: 'pikachu', level: 12 })
    ]

    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: { pk: 'pikachu', foo: 'bar' } }
    ])

    isTransactionCancelled(error, ...transactions)
    expect(error.CancellationReasons?.[0]?.FormattedItem).toBeUndefined()
  })

  test('does not augment when no transactions are provided', () => {
    const error = transactionCanceledException([
      { Code: 'ConditionalCheckFailed', Item: savedPokemon }
    ])

    isTransactionCancelled(error)
    expect(error.CancellationReasons?.[0]?.FormattedItem).toBeUndefined()
  })
})
