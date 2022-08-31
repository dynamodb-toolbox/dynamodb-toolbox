import { Item, HasComputedDefaults } from 'v1/item'
import { TableV2, PrimaryKey } from 'v1/table'

import type { NeedsKeyCompute, PutItem, PutItemInput, KeyInput } from './generics'

export class EntityV2<
  N extends string = string,
  T extends TableV2 = TableV2,
  I extends Item = Item
> {
  public name: N
  public table: T
  public item: I
  // any is needed for contravariance
  computeKey: (keyInput: Item extends I ? any : KeyInput<I>) => PrimaryKey<T>
  // TODO: Split in putComputeDefaults & updateComputeDefaults
  // any is needed for contravariance
  computeDefaults: (putItemInput: Item extends I ? any : PutItemInput<I, true>) => PutItem<I>

  /**
   * Define an Entity for a given table
   * (TODO: Use more @param for constructor arguments, see https://jsdoc.app/tags-param.html)
   *
   * @param name string
   * @param table Table
   * @param item Item
   * @param computeKey _(optional)_ Transforms key input to primary key
   * @param computeDefaults _(optional)_ Computes computed defaults
   */
  constructor({
    name,
    table,
    item,
    computeKey,
    computeDefaults
  }: {
    name: N
    table: T
    item: I
  } & (NeedsKeyCompute<I, T> extends true
    ? { computeKey: (keyInput: KeyInput<I>) => PrimaryKey<T> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<I> extends true
      ? { computeDefaults: (input: PutItemInput<I, true>) => PutItem<I> }
      : { computeDefaults?: undefined })) {
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this.item = item

    if (computeKey) {
      this.computeKey = computeKey
    } else {
      this.computeKey = ((keyInput: Record<string, any>) => {
        const partitionKeyValue = keyInput[this.table.partitionKey.name]

        if (!this.table.sortKey?.name) {
          return { [this.table.partitionKey.name]: partitionKeyValue }
        }

        const sortKeyValue = keyInput[this.table.sortKey.name]

        return {
          [this.table.partitionKey.name]: partitionKeyValue,
          [this.table.sortKey.name]: sortKeyValue
        }
      }) as any
    }

    if (computeDefaults) {
      this.computeDefaults = computeDefaults
    } else {
      this.computeDefaults = ((putItemInput: PutItemInput<I, true>) => putItemInput) as any
    }
  }
}
