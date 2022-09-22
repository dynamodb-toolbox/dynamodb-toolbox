import { Item, HasComputedDefaults } from 'v1/item'
import { TableV2, PrimaryKey } from 'v1/table'

import type { NeedsKeyCompute, PutItem, PutItemInput, KeyInput } from './generics'
import { defaultComputeDefaults } from './utils/defaultComputeDefaults'
import { getDefaultComputeKey } from './utils/defaultComputeKey'

export class EntityV2<
  EntityName extends string = string,
  EntityTable extends TableV2 = TableV2,
  EntityItem extends Item = Item
> {
  public _type: 'entity'
  public name: EntityName
  public table: EntityTable
  public item: EntityItem
  // any is needed for contravariance
  computeKey: (
    keyInput: Item extends EntityItem ? any : KeyInput<EntityItem>
  ) => PrimaryKey<EntityTable>
  // TODO: Split in putComputeDefaults & updateComputeDefaults
  // any is needed for contravariance
  computeDefaults: (
    putItemInput: Item extends EntityItem ? any : PutItemInput<EntityItem, true>
  ) => PutItem<EntityItem>

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
    name: EntityName
    table: EntityTable
    item: EntityItem
  } & (NeedsKeyCompute<EntityItem, EntityTable> extends true
    ? { computeKey: (keyInput: KeyInput<EntityItem>) => PrimaryKey<EntityTable> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<EntityItem> extends true
      ? { computeDefaults: (input: PutItemInput<EntityItem, true>) => PutItem<EntityItem> }
      : { computeDefaults?: undefined })) {
    this._type = 'entity'
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this.item = item

    this.computeKey = computeKey ?? (getDefaultComputeKey(this.table) as any)
    this.computeDefaults = computeDefaults ?? (defaultComputeDefaults as any)
  }
}
