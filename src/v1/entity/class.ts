import type { HasComputedDefaults, Item } from 'v1/item'
import type { TableV2, PrimaryKey } from 'v1/table'

import type {
  NeedsKeyCompute,
  KeyInput,
  ItemPutDefaultsComputer,
  ItemDefaultsComputer
} from './generics'
import { addEntityNameAttribute, WithEntityNameAttribute } from './utils'

export class EntityV2<
  NAME extends string = string,
  TABLE extends TableV2 = TableV2,
  ITEM extends Item = Item,
  ENTITY_NAME_ATTRIBUTE_NAME extends string = string extends NAME ? string : 'entity',
  // TODO: See if possible not to add it as a generic here
  PUT_DEFAULTS_COMPUTER = Item extends ITEM ? ItemDefaultsComputer : ItemPutDefaultsComputer<ITEM>,
  CONSTRUCTOR_PUT_DEFAULTS_COMPUTER extends PUT_DEFAULTS_COMPUTER = PUT_DEFAULTS_COMPUTER
> {
  public type: 'entity'
  public name: NAME
  public table: TABLE
  public item: WithEntityNameAttribute<ITEM, TABLE, ENTITY_NAME_ATTRIBUTE_NAME, NAME>
  public entityNameAttributeName: ENTITY_NAME_ATTRIBUTE_NAME
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
    computedDefaults,
    entityNameAttributeName = 'entity' as ENTITY_NAME_ATTRIBUTE_NAME
  }: {
    name: NAME
    table: TABLE
    item: ITEM
    entityNameAttributeName?: ENTITY_NAME_ATTRIBUTE_NAME
  } & (NeedsKeyCompute<ITEM, TABLE> extends true
    ? { computeKey: (keyInput: KeyInput<ITEM>) => PrimaryKey<TABLE> }
    : { computeKey?: undefined }) &
    (HasComputedDefaults<ITEM> extends true
      ? { computedDefaults: CONSTRUCTOR_PUT_DEFAULTS_COMPUTER }
      : { computedDefaults?: undefined })) {
    this.type = 'entity'
    this.name = name
    this.table = table
    this.entityNameAttributeName = entityNameAttributeName

    // TODO: validate that item respects table key design
    this.item = addEntityNameAttribute({
      item,
      table,
      entityNameAttributeName,
      entityName: name
    })

    this.computeKey = computeKey as any
    this.computedDefaults = computedDefaults
  }
}
