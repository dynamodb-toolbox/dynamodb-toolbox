import { _Item, _HasComputedDefaults, freezeItem, FreezeItem, Item } from 'v1/item'
import { TableV2, PrimaryKey } from 'v1/table'

import type {
  _NeedsKeyCompute,
  KeyInput,
  _KeyInput,
  _ItemPutDefaultsComputer,
  ItemDefaultsComputer
} from './generics'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  _ITEM extends _Item = _Item,
  // TODO: See if possible not to add it as a generic here
  PUT_DEFAULTS_COMPUTER = _Item extends _ITEM
    ? ItemDefaultsComputer
    : _ItemPutDefaultsComputer<_ITEM>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER,
  ITEM extends Item = FreezeItem<_ITEM>
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public _item: _ITEM
  public item: ITEM
  // any is needed for contravariance
  computeKey?: (keyInput: _Item extends _ITEM ? any : KeyInput<ITEM>) => PrimaryKey<TABLE>
  computedDefaults?: PUT_DEFAULTS_COMPUTER

  /**
   * Define an Entity for a given table
   * (TODO: Use more @param for constructor arguments, see https://jsdoc.app/tags-param.html)
   *
   * @param name string
   * @param table Table
   * @param item Item
   * @param computeKey _(optional)_ Transforms key input to primary key
   * @param computedDefaults _(optional)_ Computes computed defaults
   */
  constructor({
    name,
    table,
    item: _item,
    computeKey,
    computedDefaults
  }: {
    name: NAME
    table: TABLE
    item: _ITEM
  } & (_NeedsKeyCompute<_ITEM, TABLE> extends true
    ? { computeKey: (keyInput: _KeyInput<_ITEM>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (_HasComputedDefaults<_ITEM> extends true
      ? { computedDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { computedDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this._item = _item
    this.item = freezeItem(_item) as any

    this.computeKey = computeKey as any
    this.computedDefaults = computedDefaults
  }
}
