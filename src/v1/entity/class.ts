import { HasComputedDefaults, Item } from 'v1/item'
import { TableV2, PrimaryKey } from 'v1/table'

import type {
  NeedsKeyCompute,
  KeyInput,
  ItemPutDefaultsComputer,
  ItemDefaultsComputer
} from './generics'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  ITEM extends Item = Item,
  // TODO: See if possible not to add it as a generic here
  PUT_DEFAULTS_COMPUTER = Item extends ITEM ? ItemDefaultsComputer : ItemPutDefaultsComputer<ITEM>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public item: ITEM
  // any is needed for contravariance
  computeKey?: (keyInput: Item extends ITEM ? any : KeyInput<ITEM>) => PrimaryKey<TABLE>
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
    item,
    computeKey,
    computedDefaults
  }: {
    name: NAME
    table: TABLE
    item: ITEM
  } & (NeedsKeyCompute<ITEM, TABLE> extends true
    ? { computeKey: (keyInput: KeyInput<ITEM>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<ITEM> extends true
      ? { computedDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { computedDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table

    // TODO: validate that item respects table key design
    this.item = item

    this.computeKey = computeKey as any
    this.computedDefaults = computedDefaults
  }
}
