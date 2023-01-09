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

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  _ITEM extends _Item = _Item,
  // TODO: See if possible not to add it as a generic here
  ITEM extends Item = FreezeItem<_ITEM>
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public _item: _ITEM
  public item: ITEM
  // any is needed for contravariance
  computeKey?: (keyInput: _Item extends _ITEM ? any : KeyInput<ITEM>) => PrimaryKey<TABLE>
  // TODO: Split in putComputeDefaults & updateComputeDefaults
  // any is needed for contravariance
  computeDefaults?: (
    putItemInput: _Item extends _ITEM ? any : PutItemInput<ITEM, true>
  ) => PutItem<ITEM>

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
    name: NAME
    table: TABLE
    item: _ITEM
  } & (_NeedsKeyCompute<_ITEM, TABLE> extends true
    ? { computeKey: (keyInput: _KeyInput<_ITEM>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (_HasComputedDefaults<_ITEM> extends true
      ? { computeDefaults: (input: _PutItemInput<_ITEM, true>) => _PutItem<_ITEM> }
      : { computeDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this._item = _item
    this.item = freezeItem(_item) as any

    this.computeKey = computeKey as any
    this.computeDefaults = computeDefaults as any
  }
}
