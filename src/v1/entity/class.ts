import { _Item, _HasComputedDefaults, freezeItem, FreezeItem, Item } from 'v1/item'
import { TableV2, PrimaryKey } from 'v1/table'

import type {
  _NeedsKeyCompute,
  PutItem,
  _PutItem,
  PutItemInput,
  _PutItemInput,
  KeyInput,
  _KeyInput
} from './generics'
import { defaultComputeDefaults } from './utils/defaultComputeDefaults'
import { getDefaultComputeKey } from './utils/defaultComputeKey'

export class EntityV2<
  EntityName extends string = string,
  EntityTable extends TableV2 = TableV2,
  _EntityItem extends _Item = _Item,
  // TODO: See if possible not to add it as a generic here
  EntityItem extends Item = FreezeItem<_EntityItem>
> {
  public type: 'entity'
  public name: EntityName
  public table: EntityTable
  public _item: _EntityItem
  public item: EntityItem
  // any is needed for contravariance
  computeKey: (
    keyInput: _Item extends _EntityItem ? any : KeyInput<EntityItem>
  ) => PrimaryKey<EntityTable>
  // TODO: Split in putComputeDefaults & updateComputeDefaults
  // any is needed for contravariance
  computeDefaults: (
    putItemInput: _Item extends _EntityItem ? any : PutItemInput<EntityItem, true>
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
    item: _item,
    computeKey,
    computeDefaults
  }: {
    name: EntityName
    table: EntityTable
    item: _EntityItem
  } & (_NeedsKeyCompute<_EntityItem, EntityTable> extends true
    ? { computeKey: (keyInput: _KeyInput<_EntityItem>) => PrimaryKey<EntityTable> }
    : { computeKey?: undefined }) &
    (_HasComputedDefaults<_EntityItem> extends true
      ? { computeDefaults: (input: _PutItemInput<_EntityItem, true>) => _PutItem<_EntityItem> }
      : { computeDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this._item = _item
    this.item = freezeItem(_item) as any

    this.computeKey = computeKey ?? (getDefaultComputeKey(this.table) as any)
    this.computeDefaults = computeDefaults ?? (defaultComputeDefaults as any)
  }
}
