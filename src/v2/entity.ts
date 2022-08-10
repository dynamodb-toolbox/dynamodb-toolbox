import { O } from 'ts-toolbelt'

import {
  Item,
  ItemSavedAs,
  ItemInput,
  ItemOutput,
  ItemKeyInput,
  ItemPreComputeKey
} from './attributes'
import { Table, PrimaryKey, IndexableKeyType, ResolveIndexableKeyType } from './table'

type KeyComputer = (
  keyOutputs: Record<string, any>
) => Record<string, ResolveIndexableKeyType<IndexableKeyType>>

export class Entity<
  T extends Table = Table,
  N extends string = string,
  I extends Item = Item,
  K extends Record<string, any> = ItemPreComputeKey<I>
> {
  public name: N
  public item: I
  public table: T
  computeKey: KeyComputer

  constructor({
    name,
    item,
    table,
    computeKey
  }: {
    name: N
    item: I
    table: T
  } & (K extends PrimaryKey<T>
    ? { computeKey?: (preComputeKey: K) => PrimaryKey<T> }
    : { computeKey: (preComputeKey: K) => PrimaryKey<T> })) {
    this.name = name
    this.item = item
    this.table = table

    if (computeKey) {
      this.computeKey = computeKey as KeyComputer
    } else {
      this.computeKey = (preComputeKey: Record<string, any>) => {
        const partitionKeyValue = preComputeKey[this.table.partitionKey.name]

        if (!this.table.sortKey?.name) {
          return { [this.table.partitionKey.name]: partitionKeyValue }
        }

        const sortKeyValue = preComputeKey[this.table.sortKey.name]

        return {
          [this.table.partitionKey.name]: partitionKeyValue,
          [this.table.sortKey.name]: sortKeyValue
        }
      }
    }
  }
}

export type SavedAs<E extends Entity> = O.Merge<ItemSavedAs<E['item']>, PrimaryKey<E['table']>>

export type Input<E extends Entity> = ItemInput<E['item']>

export type Output<E extends Entity> = ItemOutput<E['item']>

export type KeyInputs<E extends Entity> = ItemKeyInput<E['item']>

export type KeyOutputs<E extends Entity> = ItemPreComputeKey<E['item']>
