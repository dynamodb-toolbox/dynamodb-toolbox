import { O } from 'ts-toolbelt'

import {
  Item,
  SavedAs as $SavedAs,
  Input as $Input,
  Output as $Output,
  KeyInputs as $KeyInputs
} from './attributes'
import { Table, Key } from './table'

type PotentialPartitionKey<T extends Table = Table, I extends Item = Item> = Item extends I
  ? string
  : O.SelectKeys<
      I['_properties'],
      { _type: T['partitionKey']['type']; _required: true; _key: true }
    >

type PotentialSortKey<T extends Table = Table, I extends Item = Item> = Item extends I
  ? string | undefined
  : Key extends NonNullable<T['sortKey']>
  ? undefined
  : O.SelectKeys<
      I['_properties'],
      { _type: NonNullable<T['sortKey']>['type']; _required: true; _key: true }
    >

export class Entity<
  T extends Table = Table,
  N extends string = string,
  I extends Item = Item,
  P extends PotentialPartitionKey<T, I> = PotentialPartitionKey<T, I>,
  S extends PotentialSortKey<T, I> = PotentialSortKey<T, I>
> {
  public name: N
  public item: I
  public table: T
  public partitionKey: P
  public sortKey: S

  constructor({
    name,
    item,
    table,
    partitionKey,
    sortKey
  }: {
    name: N
    item: I
    table: T
    partitionKey: P
    sortKey: S
  }) {
    this.name = name
    this.item = item
    this.table = table
    this.partitionKey = partitionKey
    this.sortKey = sortKey
  }
}

export type SavedAs<E extends Entity> = $SavedAs<E['item']>

export type Input<E extends Entity> = $Input<E['item']>

export type Output<E extends Entity> = $Output<E['item']>

export type KeyInputs<E extends Entity> = $KeyInputs<E['item']>
